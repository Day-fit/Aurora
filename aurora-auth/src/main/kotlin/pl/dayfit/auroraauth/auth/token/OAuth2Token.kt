package pl.dayfit.auroraauth.auth.token

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import java.util.UUID

class OAuth2Token(val id: UUID, authority: Collection<GrantedAuthority>): AbstractAuthenticationToken(authority) {
    init {
        isAuthenticated = true
    }

    override fun getCredentials(): Any? {
        return null
    }

    override fun getPrincipal(): UUID {
        return id
    }
}