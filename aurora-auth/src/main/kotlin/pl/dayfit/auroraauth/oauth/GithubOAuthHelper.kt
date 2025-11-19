package pl.dayfit.auroraauth.oauth

import org.springframework.http.*
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest
import org.springframework.security.oauth2.client.endpoint.RestClientAuthorizationCodeTokenResponseClient
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationExchange
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationResponse
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import pl.dayfit.auroraauth.configuration.properties.OAuthConfigurationProperties
import pl.dayfit.auroraauth.oauth.domain.OAuthUser
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.type.AuthProvider
import kotlin.io.encoding.Base64


@Component
class GithubOAuthHelper(
    private val oauthRestTemplate: RestTemplate,
    private val properties: OAuthConfigurationProperties,
    private val userRepository: UserRepository
) : OAuth2Helper {
    private val client = RestClientAuthorizationCodeTokenResponseClient()
    private val clientRegistration = ClientRegistration.withRegistrationId("github")
        .clientId(properties.githubClientId)
        .clientSecret(properties.githubClientSecret)
        .tokenUri(properties.githubTokenUri)
        .redirectUri(properties.githubRedirectUri)
        .scope(properties.githubScope)
        .build()

    override fun validate(token: String): OAuthUser {
        val url = "https://api.github.com/applications/${properties.githubClientId}/token"
        val credentials = "${properties.githubClientId}:${properties.githubClientSecret}"
        val encodedAuth = Base64.encode(credentials.toByteArray())

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_JSON
            set(HttpHeaders.AUTHORIZATION, "Basic $encodedAuth")
        }

        val requestBody = mapOf("access_token" to token)
        val request = HttpEntity(requestBody, headers)

        val response = oauthRestTemplate.exchange<Map<String, Any>>(
            url,
            HttpMethod.POST,
            request
        )

        if (response.statusCode != HttpStatus.OK) {
            throw IllegalArgumentException("Invalid GitHub token: ${response.statusCode}")
        }

        val userMap = response.body?.get("user") as? Map<*, *>?
        val userId = userMap?.get("id") ?: throw IllegalArgumentException("No user info returned")

        val emailUrl = "https://api.github.com/user/emails"
        val emailHeaders = HttpHeaders().apply {
            set(HttpHeaders.AUTHORIZATION, "Bearer $token")
            accept = listOf(MediaType.APPLICATION_JSON)
        }

        val emailResponse = oauthRestTemplate.exchange<List<Map<String, Any>>>(
            emailUrl,
            HttpMethod.GET,
            HttpEntity<Void>(emailHeaders)
        )

        val email = emailResponse.body
            ?.firstOrNull { it["primary"] == true && it["verified"] == true }
            ?.get("email") as? String
            ?: throw IllegalArgumentException("No verified email found for GitHub user $userId")

        val appUser = userRepository
            .findByEmail(email)
            .orElseThrow { UsernameNotFoundException("User with email $email is not registered") }

        return OAuthUser(
            appUser.id!!,
            email,
        )
    }

    override fun supports(provider: AuthProvider): Boolean {
        return provider == AuthProvider.GITHUB
    }

    override fun changeAuthorizationTokenToAccessToken(authorizationToken: String): String {
        val request = OAuth2AuthorizationRequest.authorizationCode()
            .authorizationUri(properties.githubTokenUri)
            .clientId(properties.githubClientId)
            .redirectUri(clientRegistration.redirectUri)
            .scopes(clientRegistration.scopes)
            .state("github-state")
            .build()

        val response = OAuth2AuthorizationResponse.success(authorizationToken)
            .redirectUri(clientRegistration.redirectUri)
            .state("github-state")
            .build()

        val exchange = OAuth2AuthorizationExchange(request, response)
        val grant = OAuth2AuthorizationCodeGrantRequest(clientRegistration, exchange)

        val tokenResponse = client.getTokenResponse(grant)
            ?: throw IllegalStateException("GitHub token exchange failed")

        return tokenResponse.accessToken.tokenValue
    }

}