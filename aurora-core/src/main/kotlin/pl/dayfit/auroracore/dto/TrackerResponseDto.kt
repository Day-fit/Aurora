package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.TrackerStatus
import pl.dayfit.auroracore.type.TrackerType

data class TrackerResponseDto(
    val trackerId: String,
    val status: TrackerStatus,
    val type: TrackerType
)
