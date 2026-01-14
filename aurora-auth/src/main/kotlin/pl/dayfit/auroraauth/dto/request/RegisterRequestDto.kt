package pl.dayfit.auroraauth.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import pl.dayfit.auroraauth.type.AuthProvider

data class RegisterRequestDto(
    @field:NotBlank(message = "Username cannot be blank.")
    @field:Pattern(regexp = "^[A-Za-z0-9_.]+$", message = "Username can only contain letters, numbers, underscores and periods.")
    val username: String,
    @field:NotBlank(message = "Email cannot be blank.")
    @field:Email(message = "Email is not valid.")
    val email: String,
    val password: String?,
    val provider: AuthProvider
)
