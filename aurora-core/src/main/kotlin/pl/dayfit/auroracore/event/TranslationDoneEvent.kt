package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.dto.TranslationResumeDto
import pl.dayfit.auroracore.type.LanguageType

data class TranslationDoneEvent(
    val trackerId: String,
    val newLanguageType: LanguageType,
    val resume: TranslationResumeDto,
)