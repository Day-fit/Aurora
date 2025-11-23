package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.AutoGenerationSource

data class AutoGenerationRequestDto(
    val source: AutoGenerationSource,
    val name: String
)
