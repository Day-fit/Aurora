package pl.dayfit.auroracore.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import pl.dayfit.auroracore.type.EducationDegree

@Entity
data class Education (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    var institution: String,
    var major: String?,
    var degree: EducationDegree,
    var fromYear: Int,
    var toYear: Int?
)