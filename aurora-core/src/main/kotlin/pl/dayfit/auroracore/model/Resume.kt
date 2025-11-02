package pl.dayfit.auroracore.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Lob
import jakarta.persistence.OneToMany
import java.time.Instant
import java.util.UUID

@Entity
class Resume(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID?,
    var auroraUserId: UUID,

    var name: String,
    var surname: String,
    var age: Int,
    @Column(length = 500)
    var title: String,
    @OneToMany(cascade = [CascadeType.ALL])
    var experiences: List<Experience>? = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL])
    var skills: List<Skill>? = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL])
    var education: List<Education>? = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL])
    var achievements: List<Achievement>? = mutableListOf(),
    var photo: ByteArray? = null,
    @Column(length = 2000)
    var description: String?,

    //Contact information
    var email: String,
    var website: String?,
    var linkedIn: String?,
    var gitHub: String?,

    @Lob
    var generatedResult: ByteArray?,
    var templateVersion: Int,
    var lastUpdate: Instant
)
