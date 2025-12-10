package pl.dayfit.auroracore.model.redis

import org.springframework.data.annotation.Id
import org.springframework.data.redis.core.RedisHash
import pl.dayfit.auroracore.dto.AutoGenerationDto
import pl.dayfit.auroracore.type.TrackerStatus
import java.util.UUID

@RedisHash("AutoGenerationTracker", timeToLive = 900)
data class AutoGenerationTracker (
    @Id
    var id: String?,
    val ownerId: UUID,
    var status: TrackerStatus,
    var result: AutoGenerationDto?
)