package pl.dayfit.auroraauth.dto.request

import pl.dayfit.auroraauth.type.AuthProvider

data class OAuthTokenExchangeDto(
    val accessToken: String,
    val provider: AuthProvider
)
