package pl.dayfit.auroraauth.auth.token
import org.springframework.security.authentication.AbstractAuthenticationToken

class CredentialsTokenCandidate(val identifier: String, val password: String) : AbstractAuthenticationToken(listOf()) {
    override fun getCredentials(): String {
        return password
    }

    override fun getPrincipal(): String {
        return identifier
    }

    override fun isAuthenticated(): Boolean {
        return false
    }
}