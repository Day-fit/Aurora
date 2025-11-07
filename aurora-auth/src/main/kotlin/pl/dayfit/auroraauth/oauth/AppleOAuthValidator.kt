package pl.dayfit.auroraauth.oauth

import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.configuration.properties.OAuthConfigurationProperties
import pl.dayfit.auroraauth.oauth.domain.OAuthUser
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.type.AuthProvider

@Component
class AppleOAuthValidator(
    private val properties: OAuthConfigurationProperties,
    private val userRepository: UserRepository
) : OAuth2Validator {
    override fun validate(token: String): OAuthUser {
        val decoder = NimbusJwtDecoder
            .withJwkSetUri(properties.appleJwksUri)
            .build()

        val jwt = decoder.decode(token)

        require(jwt.claims["iss"] == "https://appleid.apple.com")
        require(jwt.claims["email_verified"] == "true")

        jwt.audience
            .find { aud -> aud == properties.appleClientId }


        val email = jwt.claims["email"].toString()
        val appUser = userRepository
            .findByEmail(email)
            .orElseThrow { UsernameNotFoundException("User with email $email is not registered") }

        return OAuthUser(
            appUser.id!!,
            email,
        )
    }

    override fun supports(provider: AuthProvider): Boolean {
        return provider == AuthProvider.APPLE
    }
}