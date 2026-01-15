package pl.dayfit.auroraai.event

import pl.dayfit.auroraai.dto.TranslationResumeDto
import pl.dayfit.auroraai.type.LanguageType

data class TranslationDoneEvent(
    val trackerId: String,
    val newLanguageType: LanguageType,
    val resume: TranslationResumeDto,
)