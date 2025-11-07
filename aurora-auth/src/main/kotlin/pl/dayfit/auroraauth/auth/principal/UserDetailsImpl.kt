package pl.dayfit.auroraauth.auth.principal

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.UUID

class UserDetailsImpl(
    private val authorities: Collection<GrantedAuthority>,
    private val password: String,
    private val username: String,
    private val id: UUID,
    private val banned: Boolean,
    private val enabled: Boolean
    ) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return authorities
    }

    override fun getPassword(): String {
        return password
    }

    override fun getUsername(): String {
        return username
    }

    override fun isAccountNonLocked(): Boolean
    {
        return !banned
    }

    override fun isEnabled(): Boolean {
        return enabled
    }

    fun getId(): UUID {
        return id
    }
}