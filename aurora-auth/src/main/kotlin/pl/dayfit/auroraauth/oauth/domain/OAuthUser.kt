package pl.dayfit.auroraauth.oauth.domain

import java.util.UUID

data class OAuthUser(
    val id: UUID,
    val email: String
    )