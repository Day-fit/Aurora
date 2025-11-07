package pl.dayfit.auroraauth.dto.request

import pl.dayfit.auroraauth.type.AuthProvider

data class LoginRequestDto(
    val identifier: String,
    val password: String?,
    val provider: AuthProvider
)
