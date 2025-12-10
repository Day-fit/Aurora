package pl.dayfit.auroraauth.auth.provider

import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.auth.principal.UserDetailsImpl
import pl.dayfit.auroraauth.auth.token.CredentialsToken
import pl.dayfit.auroraauth.auth.token.CredentialsTokenCandidate
import pl.dayfit.auroraauth.service.UserDetailsServiceImpl

@Component
class CredentialsAuthProvider(
    val passwordEncoder: PasswordEncoder,
    val userDetailsServiceImpl: UserDetailsServiceImpl
) : AuthenticationProvider {
    override fun authenticate(authentication: Authentication): Authentication {
        if (!supports(authentication::class.java)) {
            throw IllegalArgumentException("Only CredentialsTokenCandidate is supported")
        }

        val candidate = authentication as CredentialsTokenCandidate
        val userDetails = userDetailsServiceImpl
            .loadUserByUsername(
                candidate.identifier
            ) as UserDetailsImpl

        if (!passwordEncoder.matches(candidate.password, userDetails.password)) {
            throw BadCredentialsException("Username or password is incorrect")
        }

        if (!userDetails.isAccountNonLocked) {
            throw AccessDeniedException("User is locked")
        }

        if (!userDetails.isEnabled) {
            throw AccessDeniedException("User is disabled")
        }

        //TODO: replace ifs with more robust logic (e.g chain of responsibility)

        return CredentialsToken(
            userDetails.authorities,
            userDetails.username,
            userDetails.getId(),
            userDetails.password
        )
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication.isAssignableFrom(CredentialsTokenCandidate::class.java)
    }
}