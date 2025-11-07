package pl.dayfit.auroraauth.service

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.auth.principal.UserDetailsImpl
import pl.dayfit.auroraauth.model.AuroraUser
import pl.dayfit.auroraauth.repository.UserRepository
import java.util.UUID

@Service
class UserDetailsServiceImpl(val repository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val isUsername = !username.contains('@')

        val user: AuroraUser = if (isUsername) repository.findByUsername(username)
            .orElseThrow { UsernameNotFoundException("Username or password is incorrect") }
        else repository.findByEmail(username)
            .orElseThrow { UsernameNotFoundException("Username or password is incorrect") }

        return UserDetailsImpl(
            user.authorities.map { SimpleGrantedAuthority(it.toString()) },
            user.password.orEmpty(),
            user.username,
            user.id!!,
            user.banned,
            user.enabled
        )
    }

    fun loadUserById(id: UUID): UserDetails {
        val user = repository.findById(id)
            .orElseThrow { UsernameNotFoundException("User with id $id not found") }

        return UserDetailsImpl(
            user.authorities.map { SimpleGrantedAuthority(it.toString()) },
            user.password.orEmpty(),
            user.username,
            user.id!!,
            user.banned,
            user.enabled
        )
    }
}