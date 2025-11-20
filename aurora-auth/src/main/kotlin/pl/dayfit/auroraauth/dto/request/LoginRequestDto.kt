package pl.dayfit.auroraauth.dto.request

import jakarta.validation.constraints.NotBlank
import pl.dayfit.auroraauth.type.AuthProvider

data class LoginRequestDto(
    @field:NotBlank(message = "Identifier cannot be blank.")
    val identifier: String,
    @field:NotBlank(message = "Password cannot be blank.")
    val password: String?,
    val provider: AuthProvider
)
