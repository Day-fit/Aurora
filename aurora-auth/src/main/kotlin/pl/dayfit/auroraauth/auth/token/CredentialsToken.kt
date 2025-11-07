package pl.dayfit.auroraauth.auth.token

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import java.util.UUID

class CredentialsToken(
    private val authorities: Collection<GrantedAuthority>,
    private val username: String,
    private val id: UUID,
    private val password: String
) : AbstractAuthenticationToken(authorities) {
    override fun getCredentials(): Any {
        return password
    }

    override fun getPrincipal(): Any {
        return username
    }

    override fun isAuthenticated(): Boolean {
        return true
    }

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return authorities
    }

    fun getId(): UUID {
        return id
    }
}