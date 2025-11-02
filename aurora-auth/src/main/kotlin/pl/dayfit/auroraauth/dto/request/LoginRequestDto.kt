package pl.dayfit.auroraauth.dto.request

data class LoginRequestDto(
    val identifier: String,
    val password: String
)
