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
    val education: List<Education>,
    val skills: List<Skill>,
    val experiences: List<Experience>,
    val achievements: List<Achievement>,
)
{
    data class Education (
        val institution: String,
        val major: String?,
        val degree: EducationDegree,
        val fromYear: Int,
        val toYear: Int?
    )

    data class Experience (
        val company: String,
        val position: String,
        val description: String?,
        val startDate: Instant,
        val endDate: Instant?
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
