package pl.dayfit.auroraauth.oauth

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.hibernate.query.results.Builders.entity
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import pl.dayfit.auroraauth.configuration.properties.OAuthConfigurationProperties
import pl.dayfit.auroraauth.oauth.domain.OAuthUser
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.type.AuthProvider

@Component
class GoogleOAuthValidator(
    private val properties: OAuthConfigurationProperties,
    private val userRepository: UserRepository,
    private val restTemplate: RestTemplate,
) : OAuth2Validator {
    override fun validate(token: String): OAuthUser {
        val headers = HttpHeaders().apply {
            setBearerAuth(token)
        }

        val entity = HttpEntity<String>(headers)

        val userInfo = try {
            restTemplate.exchange(
                properties.googleUserInfoUri,
                HttpMethod.GET,
                entity,
                String::class.java
            ).body
        } catch (ex: HttpClientErrorException) {
            if (ex.statusCode.value() == 401) {
                throw BadCredentialsException("Invalid token")
            }

            throw IllegalStateException("Could not fetch user info, try again later", ex)
        }

        val email = jacksonObjectMapper().readTree(userInfo)
            .get("email")?.asText()
            ?: throw BadCredentialsException("Invalid email")

        val appUser = userRepository
            .findByEmail(email)
            .orElseThrow { BadCredentialsException("User with email $email is not registered") }
            //TODO: create user if not exists
            //TODO: check if user is enabled

        return OAuthUser(
            appUser.id!!,
            email
        )
    }

    override fun supports(provider: AuthProvider): Boolean {
        return provider == AuthProvider.GOOGLE
    }
}