package pl.dayfit.auroraai.event

import pl.dayfit.auroraai.dto.TranslationResumeDto
import pl.dayfit.auroraai.type.LanguageType

data class TranslationRequestedEvent(
    val targetLanguage: LanguageType,
    val originalResume: TranslationResumeDto
)
