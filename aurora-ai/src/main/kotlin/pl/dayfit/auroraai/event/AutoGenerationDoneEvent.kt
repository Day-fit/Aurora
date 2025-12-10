package pl.dayfit.auroraai.event

import pl.dayfit.auroraai.dto.AutoGenerationDto

data class AutoGenerationDoneEvent(
    val trackerId: String,
    val result: AutoGenerationDto
)
