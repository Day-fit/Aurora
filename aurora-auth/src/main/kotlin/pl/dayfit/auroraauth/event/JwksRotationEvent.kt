package pl.dayfit.auroraauth.event

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.Instant

@JsonInclude(JsonInclude.Include.NON_NULL)
data class JwksRotationEvent (
    val keyId: Int,
    val createdAt: Instant,
    val validFrom: Instant,
)