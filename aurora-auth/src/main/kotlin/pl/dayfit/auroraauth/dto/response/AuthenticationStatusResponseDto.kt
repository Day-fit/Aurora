package pl.dayfit.auroraauth.dto.response

import pl.dayfit.auroraauth.type.AuthenticationStatus
import java.util.UUID

data class AuthenticationStatusResponseDto (
    val userId: UUID?,
    val status: AuthenticationStatus
)