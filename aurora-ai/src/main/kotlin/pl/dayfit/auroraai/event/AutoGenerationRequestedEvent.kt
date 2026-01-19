package pl.dayfit.auroraai.event

import pl.dayfit.auroraai.dto.InformationDto
import pl.dayfit.auroraai.type.AutoGenerationSource
import pl.dayfit.auroraai.type.LanguageType

data class AutoGenerationRequestedEvent(
    val id: String,
    val title: String, //adds more context for AI
    val source: AutoGenerationSource,
    val information: InformationDto,
    val language: LanguageType
)