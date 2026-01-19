package pl.dayfit.auroracore.dto

import com.fasterxml.jackson.annotation.JsonInclude
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Length
import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.SkillLevel
import java.time.Instant
import java.util.UUID

data class EditResumeDto(
    val resumeId: UUID,

    @JsonInclude(JsonInclude.Include.NON_NULL)
    val name: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val surname: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Length(max = 200)
    val title: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Email(message = "Given email is not valid")
    val email: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val website: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val linkedIn: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val gitHub: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val profileImage: String?,
    @Length(max = 2000)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val profileDescription: String?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val education: List<Education>?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val skills: List<Skill>?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val workExperience: List<Experience>?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val achievements: List<Achievement>?,
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val personalPortfolio: List<PersonalPortfolio>?,

    @Min(1)
    @Max(5)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    val templateVersion: Int?,

    @JsonInclude(JsonInclude.Include.NON_NULL)
    val enhanced: Boolean = false
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

    data class PersonalPortfolio (
        val name: String,
        val description: String
    )
}