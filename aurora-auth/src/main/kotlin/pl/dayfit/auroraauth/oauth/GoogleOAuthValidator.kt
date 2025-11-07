package pl.dayfit.auroraauth.oauth

import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.configuration.properties.OAuthConfigurationProperties
import pl.dayfit.auroraauth.oauth.domain.OAuthUser
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.type.AuthProvider

@Component
class GoogleOAuthValidator(
    private val properties: OAuthConfigurationProperties,
    private val userRepository: UserRepository
) : OAuth2Validator {
    override fun validate(token: String): OAuthUser {
        val decoder = NimbusJwtDecoder.withJwkSetUri(properties.googleJwksUri)
            .build()

        val jwt = decoder.decode(token)
        val result = jwt.audience.find { aud -> aud == properties.googleClientId }

        if (result == null) {
            throw BadCredentialsException("Invalid token")
        }

        val email = jwt.claims["email"] as String?
            ?: throw BadCredentialsException("Invalid email")

        val appUser = userRepository
            .findByEmail(email)
            .orElseThrow { BadCredentialsException("Invalid email") }

        return OAuthUser(
            appUser.id!!,
            email
        )
    }

    override fun supports(provider: AuthProvider): Boolean {
        return provider == AuthProvider.GOOGLE
    }
}