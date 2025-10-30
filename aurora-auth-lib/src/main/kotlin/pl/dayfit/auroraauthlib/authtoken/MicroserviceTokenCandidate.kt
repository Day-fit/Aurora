package pl.dayfit.auroraauthlib.authtoken

import org.springframework.security.authentication.AbstractAuthenticationToken

class MicroserviceTokenCandidate(val jwtToken: String) : AbstractAuthenticationToken(null) {
    override fun getCredentials(): Any {
        return jwtToken
    }

    override fun getPrincipal(): Any? {
        return null
    }
}