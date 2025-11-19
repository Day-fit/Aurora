package pl.dayfit.auroraauth.dto.request

import jakarta.validation.constraints.NotBlank
import pl.dayfit.auroraauth.type.AuthProvider

data class OAuthTokenExchangeDto(
    @field:NotBlank(message = "Access token cannot be blank.")
    val accessToken: String,
    val provider: AuthProvider
)
