package pl.dayfit.auroraauth.oauth

import pl.dayfit.auroraauth.type.AuthProvider

data class OAuthUserInfo(
    val username: String,
    val email: String?,
    val provider: AuthProvider
)