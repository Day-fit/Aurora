package pl.dayfit.auroraauth.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import org.springframework.security.core.GrantedAuthority
import java.util.UUID

@Entity
class AuroraUser {
    @Id
    var id: UUID? = null

    @Column(unique = true)
    lateinit var username: String
    @Column(unique = true)
    var email: String? = null

    var password: String? = null

    lateinit var authorities: List<GrantedAuthority>

    var banned: Boolean = false
    var enabled: Boolean = false
}