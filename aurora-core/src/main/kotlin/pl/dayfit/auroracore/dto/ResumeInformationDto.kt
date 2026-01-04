package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.LanguageType
import java.time.Instant
import java.util.UUID

data class ResumeInformationDto(
    val id: UUID,
    val languageType: LanguageType?,
    val size: Long,
    val lastModified: Instant,
    val originalVersionId: UUID?,
    val isEnhanced: Boolean
)
