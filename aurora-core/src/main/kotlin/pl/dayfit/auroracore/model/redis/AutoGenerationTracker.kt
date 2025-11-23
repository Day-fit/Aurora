package pl.dayfit.auroracore.model.redis

import jakarta.persistence.Id
import org.springframework.data.redis.core.RedisHash
import pl.dayfit.auroracore.dto.AutoGenerationDto
import pl.dayfit.auroracore.type.TrackerStatus

@RedisHash("AutoGenerationTracker", timeToLive = 900)
data class AutoGenerationTracker (
    @Id
    var uuid: String?,
    var status: TrackerStatus,
    var result: AutoGenerationDto?
)