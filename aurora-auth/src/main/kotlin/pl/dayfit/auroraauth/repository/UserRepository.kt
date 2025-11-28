package pl.dayfit.auroraauth.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import pl.dayfit.auroraauth.model.AuroraUser
import java.util.Optional
import java.util.UUID

@Repository
interface UserRepository : JpaRepository<AuroraUser, UUID> {
    fun findByUsername(username: String): Optional<AuroraUser>
    fun findByEmail(email: String): Optional<AuroraUser>
}