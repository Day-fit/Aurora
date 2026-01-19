package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.LanguageType
import pl.dayfit.auroracore.type.SkillLevel
import java.time.Instant
import java.util.UUID

data class ResumeDetailsDto(
    val language: LanguageType?,
    val originalVersionId: UUID?,
    val name: String,
    val surname: String,
    val title: String?,
    val workExperience: MutableList<WorkExperience> = mutableListOf(),
    val personalPortfolio: MutableList<PersonalPortfolio> = mutableListOf(),
    val skills: MutableList<Skill> = mutableListOf(),
    val education: MutableList<Education> = mutableListOf(),
    val achievements: MutableList<Achievement> = mutableListOf(),
    val profileImage: String?,
    val profileDescription: String?,

    val email: String,
    val website: String?,
    val linkedIn: String?,
    val gitHub: String?,

    val templateVersion: Int,
    val lastModified: Instant,
    val enhanced: Boolean = false
) {
    data class WorkExperience(
        val company: String,
        val position: String,
        val startDate: Instant,
        val endDate: Instant? = null,
        val description: String? = null,
    )

    data class Skill(
        val name: String,
        val level: SkillLevel
    )

    data class Education(
        val institution: String,
        val major: String?,
        val degree: EducationDegree,
        val fromYear: Int,
        val toYear: Int?
    )

    data class PersonalPortfolio(
        val name: String,
        val description: String
    )

    data class Achievement(
        val title: String,
        val description: String,
        val year: Int?
    )
}
