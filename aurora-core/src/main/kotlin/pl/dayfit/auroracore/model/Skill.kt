package pl.dayfit.auroracore.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import pl.dayfit.auroracore.type.SkillLevel

@Entity
data class Skill (
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    var id: Long? = null,

    var name: String,
    var level: SkillLevel
)