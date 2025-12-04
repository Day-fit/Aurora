package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.type.TrackerStatus

data class TrackerStatusChangedEvent(
    val id: String,
    val status: TrackerStatus
)
