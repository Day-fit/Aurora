package pl.dayfit.auroraauthlib.authprovider

import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.Authentication
import pl.dayfit.auroraauthlib.authtoken.MicroserviceTokenCandidate

class MicroserviceAuthProvider : AuthenticationProvider {
    override fun authenticate(authentication: Authentication): Authentication {
        if (authentication !is MicroserviceTokenCandidate)
        {
            throw IllegalArgumentException("Only MicroserviceTokenCandidate is supported")
        }


    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication.isAssignableFrom(MicroserviceTokenCandidate::class.java)
    }
}