package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.type.TrackerStatus

data class StatusChangedEvent(
    val trackerId: String,
    val status: TrackerStatus
)
