package pl.dayfit.auroraauthlib.auth.token

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import java.security.Principal

class MicroserviceToken(val principal: Principal, grantedAuthorities: Collection<GrantedAuthority>) : AbstractAuthenticationToken(grantedAuthorities) {
    override fun getCredentials(): Any? {
        return null
    }

    override fun getPrincipal(): Any {
        return principal
    }

    override fun isAuthenticated(): Boolean {
        return true
    }
}