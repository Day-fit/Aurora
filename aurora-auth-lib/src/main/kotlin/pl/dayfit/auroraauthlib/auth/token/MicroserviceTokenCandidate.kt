package pl.dayfit.auroraauthlib.auth.token

import org.springframework.security.authentication.AbstractAuthenticationToken

class MicroserviceTokenCandidate(val jwtToken: String) : AbstractAuthenticationToken(listOf()) {
    override fun getCredentials(): Any {
        return jwtToken
    }

    override fun getPrincipal(): Any? {
        return null
    }

    override fun isAuthenticated(): Boolean {
        return false
    }
}