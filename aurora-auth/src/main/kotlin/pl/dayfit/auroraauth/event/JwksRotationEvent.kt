package pl.dayfit.auroraauth.event

import java.time.Instant

data class JwksRotationEvent (
    val keyId: Int,
    val createdAt: Instant,
    val validFrom: Instant,
)