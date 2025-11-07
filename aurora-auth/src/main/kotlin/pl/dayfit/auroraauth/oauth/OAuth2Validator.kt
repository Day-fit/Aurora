package pl.dayfit.auroraauth.oauth

import org.springframework.security.authentication.BadCredentialsException
import pl.dayfit.auroraauth.oauth.domain.OAuthUser
import pl.dayfit.auroraauth.type.AuthProvider

interface OAuth2Validator {
    @Throws(BadCredentialsException::class)
    fun validate(token: String): OAuthUser

    fun supports(provider: AuthProvider): Boolean
}