package pl.dayfit.auroracore.model.redis

import org.springframework.data.annotation.Id
import org.springframework.data.redis.core.RedisHash
import org.springframework.data.redis.core.index.Indexed
import pl.dayfit.auroracore.type.TrackerStatus
import pl.dayfit.auroracore.type.TrackerType
import java.util.UUID

@RedisHash("ActionTracker", timeToLive = 900)
data class ActionTracker (
    @Id
    var id: String?,
    @Indexed
    val ownerId: UUID,
    var status: TrackerStatus,
    var type: TrackerType,
    var trackedResourceId: Any
)