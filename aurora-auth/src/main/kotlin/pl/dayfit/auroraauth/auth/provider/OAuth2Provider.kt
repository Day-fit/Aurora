package pl.dayfit.auroraauth.auth.provider

import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.auth.token.OAuth2Token
import pl.dayfit.auroraauth.auth.token.OAuth2TokenCandidate
import pl.dayfit.auroraauth.service.OAuthValidatorService
import pl.dayfit.auroraauth.service.UserDetailsServiceImpl

@Component
class OAuth2Provider(
    private val oauthValidatorService: OAuthValidatorService,
    private val userDetailsServiceImpl: UserDetailsServiceImpl
) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication): Authentication {
        if(!supports(authentication::class.java))
        {
            throw IllegalArgumentException("Authentication not found")
        }

        val oauthAuthentication = authentication as OAuth2TokenCandidate

        val oauthUser = oauthValidatorService.validate(
            oauthAuthentication.token,
            oauthAuthentication.authProvider
        )

        val userDetails = userDetailsServiceImpl.loadUserById(
            oauthUser.id,
        )

        return OAuth2Token(
            oauthUser.id,
            userDetails.authorities
        )
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication.isAssignableFrom(OAuth2TokenCandidate::class.java)
    }
}