package pl.dayfit.auroracore.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Length
import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.SkillLevel
import java.time.Instant

data class GenerationRequestDto (
    @NotBlank
    val name: String,
    @NotBlank
    val surname: String,
    val age: Int,
    @NotBlank
    @Length(max = 200)
    val title: String,
    @Email(message = "Given email is not valid")
    @NotBlank(message = "Email cannot be blank")
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
        @NotBlank(message = "Institution name cannot be blank")
        val institution: String,
        val major: String?,
        val degree: EducationDegree,
        val fromYear: Int,
        val toYear: Int?
    )

    data class Experience (
        @NotBlank(message = "Company name cannot be blank")
        val company: String,
        @NotBlank(message = "Position name cannot be blank")
        val position: String,
        val description: String?,
        val startDate: Instant,
        val endDate: Instant?
    )

    data class Achievement (
        @NotBlank(message = "Achievement title cannot be blank")
        val title: String,
        @NotBlank(message = "Achievement description cannot be blank")
        val description: String,
        val year: Int?
    )

    data class Skill (
        @NotBlank(message = "Skill name cannot be blank")
        val name: String,
        val level: SkillLevel
    )
}