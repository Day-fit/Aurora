package pl.dayfit.auroracore.model.redis

import org.springframework.data.annotation.Id
import org.springframework.data.redis.core.RedisHash
import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.SkillLevel
import java.time.Instant
import java.util.UUID

@RedisHash("AutoGenerationData", timeToLive = 900)
data class AutoGenerationData (
    @Id
    var id: String?,

    var ownerId: UUID,
    var age: Int?,
    var email: String?,
    var website: String?,
    var linkedIn: String?,
    var gitHub: String?,
    var profileImage: String?,
    var profileDescription: String?,
    var education: List<Education> = emptyList(),
    var skills: List<Skill> = emptyList(),
    var workExperiences: List<WorkExperience> = emptyList(),
    var personalPortfolios: List<PersonalPortfolio> = emptyList(),
    var achievements: List<Achievement> = emptyList(),
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