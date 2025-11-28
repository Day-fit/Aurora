package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.dto.TranslationResumeDto
import pl.dayfit.auroracore.type.LanguageType

data class TranslationRequestedEvent(
    val targetLanguage: LanguageType,
    val originalResume: TranslationResumeDto
)
