package pl.dayfit.auroraauth.auth.token

import org.springframework.security.authentication.AbstractAuthenticationToken
import pl.dayfit.auroraauth.type.AuthProvider

class OAuth2TokenCandidate(val authProvider: AuthProvider, val token: String) : AbstractAuthenticationToken(null) {
    init {
        isAuthenticated = false
    }

    override fun getCredentials(): String {
        return token
    }

    override fun getPrincipal(): Any? {
        return null
    }
}