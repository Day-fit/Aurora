package pl.dayfit.auroracore.service

import org.springframework.context.MessageSource
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.LanguageType
import pl.dayfit.auroracore.type.SkillLevel
import pl.dayfit.auroracore.util.LocaleMapper

/**
 * Service for localizing enum values based on the target language.
 * Uses Spring's MessageSource to provide i18n support for enum labels.
 */
@Service
class EnumLocalizationService(
    private val messageSource: MessageSource
) {
    /**
     * Get localized label for a SkillLevel enum
     */
    fun getLocalizedSkillLevel(skillLevel: SkillLevel, languageType: LanguageType?): String {
        val locale = LocaleMapper.toLocale(languageType)
        val key = "enum.skillLevel.${skillLevel.name}"
        return messageSource.getMessage(key, null, skillLevel.label, locale)
    }

    /**
     * Get localized label for an EducationDegree enum
     */
    fun getLocalizedEducationDegree(degree: EducationDegree, languageType: LanguageType?): String {
        val locale = LocaleMapper.toLocale(languageType)
        val key = "enum.educationDegree.${degree.name}"
        return messageSource.getMessage(key, null, degree.label, locale)
    }
}
