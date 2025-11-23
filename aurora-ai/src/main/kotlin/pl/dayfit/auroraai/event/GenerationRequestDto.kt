package pl.dayfit.auroraai.event

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.SkillLevel
import java.time.Instant

data class GenerationRequestDto (
    val name: String,
    val surname: String,
    val age: Int,
    val title: String,
    val email: String,
    val website: String?,
    val linkedIn: String?,
    val gitHub: String?,
    val profileImage: String?,
    val profileDescription: String?,
    val education: List<Education>,
    val skills: List<Skill>,
    val experiences: List<Experience>,
    val achievements: List<Achievement>,

    @Min(1)
    @Max(1) //TODO: Add more versions
    val templateVersion: Int,

    val enhanced : Boolean = false
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