package pl.dayfit.auroraauthlib.event

import java.time.Instant

data class JwksRotationEvent (
    val keyId: Int,
    val createdAt: Instant,
    val validFrom: Instant,
)