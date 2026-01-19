package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.AutoGenerationSource
import pl.dayfit.auroracore.type.LanguageType

data class AutoGenerationRequestDto(
    val source: AutoGenerationSource,
    val name: String,
    val title: String,
    val language: LanguageType
)
