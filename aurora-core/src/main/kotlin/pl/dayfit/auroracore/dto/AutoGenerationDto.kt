package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.SkillLevel
import java.time.Instant

data class AutoGenerationDto (
    val age: Int?,
    val email: String?,
    val website: String?,
    val linkedIn: String?,
    val gitHub: String?,
    val profileImage: String?,
    val profileDescription: String?,
    val education: List<Education> = emptyList(),
    val skills: List<Skill> = emptyList(),
    val workExperiences: List<WorkExperience> = emptyList(),
    val personalPortfolios: List<PersonalPortfolio> = emptyList(),
    val achievements: List<Achievement> = emptyList(),
)
{
    data class Education (
        val institution: String,
        val major: String?,
        val degree: EducationDegree,
        val fromYear: Int,
        val toYear: Int?
    )

    data class WorkExperience (
        val company: String,
        val position: String,
        val description: String?,
        val startDate: Instant,
        val endDate: Instant?
    )

    data class PersonalPortfolio (
        val name: String,
        val description: String
    )

    data class Achievement (
        val title: String,
        val description: String,
        val year: Int?
    )

    data class Skill (
        val name: String,
        val level: SkillLevel
    )
}
