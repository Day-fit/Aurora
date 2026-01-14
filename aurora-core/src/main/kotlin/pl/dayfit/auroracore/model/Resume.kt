package pl.dayfit.auroracore.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import pl.dayfit.auroracore.type.LanguageType
import java.time.Instant
import java.util.UUID

@Entity
class Resume(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID?,
    var auroraUserId: UUID,
    var language: LanguageType?,

    @ManyToOne(cascade = [CascadeType.DETACH])
    var originalVersion: Resume?,

    var name: String,
    var surname: String,
    var age: Int,
    @Column(length = 200)
    var title: String?,
    @OneToMany(cascade = [CascadeType.ALL], fetch = jakarta.persistence.FetchType.EAGER)
    var workExperience: MutableList<WorkExperience> = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL], fetch = jakarta.persistence.FetchType.EAGER)
    var personalPortfolio: MutableList<PersonalPortfolio> = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL], fetch = jakarta.persistence.FetchType.EAGER)
    var skills: MutableList<Skill> = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL], fetch = jakarta.persistence.FetchType.EAGER)
    var education: MutableList<Education> = mutableListOf(),
    @OneToMany(cascade = [CascadeType.ALL], fetch = jakarta.persistence.FetchType.EAGER)
    var achievements: MutableList<Achievement> = mutableListOf(),
    var profileImage: ByteArray? = null,
    @Column(length = 2000)
    var profileDescription: String?,

    //Contact information
    var email: String,
    var website: String?,
    var linkedIn: String?,
    var gitHub: String?,

    var templateVersion: Int,
    var lastModified: Instant,
    var enhanced: Boolean = false
)
