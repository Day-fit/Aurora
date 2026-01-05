package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.type.TrackerType
import java.util.UUID

data class TrackerWaitingToStartEvent (
    val userId: UUID,
    val trackerType: TrackerType,
    val trackedResourceId: Any
)