package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.type.TrackerStatus
import java.util.UUID

data class StatusChangedEvent(
    val userId: UUID,
    val trackerId: String,
    val status: TrackerStatus
)
