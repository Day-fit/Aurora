package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.TrackerStatus

data class StatusChangedDto(
    val trackerId: String,
    val status: TrackerStatus
)