package pl.dayfit.auroraauthlib.authtoken

import org.springframework.security.authentication.AbstractAuthenticationToken

class MicroserviceToken(granted) : AbstractAuthenticationToken() {

    override fun getCredentials(): Any? {
        TODO("Not yet implemented")
    }

    override fun getPrincipal(): Any? {
        TODO("Not yet implemented")
    }
}