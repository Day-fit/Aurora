package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.LanguageType
import java.util.UUID

data class TranslationRequestDto (
    val id: UUID,
    val language: LanguageType
)