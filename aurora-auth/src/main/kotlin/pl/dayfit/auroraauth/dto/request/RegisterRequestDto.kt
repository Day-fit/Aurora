package pl.dayfit.auroraauth.dto.request

import pl.dayfit.auroraauth.type.AuthProvider

data class RegisterRequestDto(
    val username: String,
    val email: String?,
    val password: String?,
    val provider: AuthProvider
)
