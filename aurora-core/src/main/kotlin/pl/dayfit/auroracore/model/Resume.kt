package pl.dayfit.auroracore.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import java.time.Instant
import java.util.UUID

@Entity
class Resume(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID?,
    var userId: UUID,

    var name: String,
    var surname: String,
    var age: Int,
    @OneToMany(cascade = [CascadeType.ALL])
    var experiences: List<Experience>? = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL])
    var skills: List<Skill>? = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL])
    var education: List<Education>? = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL])
    var achievements: List<Achievement>? = mutableListOf(),
    var photo: ByteArray? = null,
    var description: String?,

    var lastUpdate: Instant
)
