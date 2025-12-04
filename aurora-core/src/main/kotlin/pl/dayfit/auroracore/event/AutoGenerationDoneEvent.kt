package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.dto.AutoGenerationDto

data class AutoGenerationDoneEvent(
    val trackerId: String,
    val result: AutoGenerationDto
)
