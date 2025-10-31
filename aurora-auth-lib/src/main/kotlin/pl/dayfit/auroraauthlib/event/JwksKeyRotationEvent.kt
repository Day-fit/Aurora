package pl.dayfit.auroraauthlib.event

import java.time.Instant

data class JwksKeyRotationEvent (
    val keyId: String,
    val key: String,
    val issuedAt: Instant
)