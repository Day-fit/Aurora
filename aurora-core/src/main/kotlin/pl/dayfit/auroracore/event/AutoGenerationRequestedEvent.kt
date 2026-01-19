package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.dto.InformationDto
import pl.dayfit.auroracore.type.AutoGenerationSource
import pl.dayfit.auroracore.type.LanguageType

data class AutoGenerationRequestedEvent (
    val id: String,
    val title: String, //adds more context for AI
    val source: AutoGenerationSource,
    val information: InformationDto,
    val language: LanguageType
)