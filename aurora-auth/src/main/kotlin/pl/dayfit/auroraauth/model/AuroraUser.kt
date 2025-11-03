package pl.dayfit.auroraauth.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import pl.dayfit.auroraauth.type.AuthProvider
import java.util.UUID

@Entity
class AuroraUser (
    @Id
    var id: UUID? = null,

    @Column(unique = true)
    var username: String,
    @Column(unique = true)
    var email: String? = null,

    var password: String? = null,

    var authorities: List<String>,

    var banned: Boolean = false,
    var enabled: Boolean = false,

    var authenticationProvider: AuthProvider
)