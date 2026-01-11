package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.dto.AutoGenerationDataDto

data class AutoGenerationDoneEvent(
    val trackerId: String,
    val result: AutoGenerationDataDto
)
