package pl.dayfit.auroraauthlib.authprovider

import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import pl.dayfit.auroraauthlib.authtoken.MicroserviceToken
import pl.dayfit.auroraauthlib.authtoken.MicroserviceTokenCandidate
import pl.dayfit.auroraauthlib.service.JwtClaimsService

@Component
class MicroserviceAuthProvider(val claimsService: JwtClaimsService) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication): Authentication {
        val candidate = (authentication as? MicroserviceTokenCandidate)
            ?: throw IllegalArgumentException("Only MicroserviceTokenCandidate is supported")

        return MicroserviceToken(
            { claimsService.getSubject(candidate.jwtToken).toString() },
                claimsService.getRoles(candidate.jwtToken)
        )
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication.isAssignableFrom(MicroserviceTokenCandidate::class.java)
    }
}