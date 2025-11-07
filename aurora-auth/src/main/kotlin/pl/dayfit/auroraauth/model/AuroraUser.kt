package pl.dayfit.auroraauth.model

import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import pl.dayfit.auroraauth.type.AuthProvider
import pl.dayfit.auroraauthlib.type.RoleType
import java.util.UUID

@Entity
class AuroraUser (
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(unique = true)
    var username: String,
    @Column(unique = true)
    var email: String? = null,

    var password: String? = null,

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    var authorities: MutableList<RoleType> = mutableListOf(),

    var banned: Boolean = false,
    var enabled: Boolean = false,

    var authenticationProvider: AuthProvider
) {
    constructor() : this(null, "", null, null, mutableListOf(), false, false, AuthProvider.LOCAL)
}