package pl.dayfit.auroracore.service

import org.springframework.context.MessageSource
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.type.EducationDegree
import pl.dayfit.auroracore.type.LanguageType
import pl.dayfit.auroracore.type.SkillLevel
import java.util.Locale

/**
 * Service for localizing enum values based on the target language.
 * Uses Spring's MessageSource to provide i18n support for enum labels.
 */
@Service
class EnumLocalizationService(
    private val messageSource: MessageSource
) {
    /**
     * Map LanguageType to Java Locale for MessageSource resolution
     */
    private fun languageTypeToLocale(languageType: LanguageType?): Locale {
        return when (languageType) {
            LanguageType.SPANISH -> Locale("es")
            LanguageType.FRENCH -> Locale("fr")
            LanguageType.GERMAN -> Locale("de")
            LanguageType.ITALIAN -> Locale("it")
            LanguageType.PORTUGUESE -> Locale("pt")
            LanguageType.RUSSIAN -> Locale("ru")
            LanguageType.MANDARIN -> Locale("zh")
            LanguageType.KOREAN -> Locale("ko")
            LanguageType.ARABIC -> Locale("ar")
            LanguageType.POLISH -> Locale("pl")
            LanguageType.DUTCH -> Locale("nl")
            LanguageType.SWEDISH -> Locale("sv")
            LanguageType.DANISH -> Locale("da")
            LanguageType.NORWEGIAN -> Locale("no")
            LanguageType.CZECH -> Locale("cs")
            LanguageType.SLOVAK -> Locale("sk")
            LanguageType.ROMANIAN -> Locale("ro")
            LanguageType.HUNGARIAN -> Locale("hu")
            LanguageType.UKRAINIAN -> Locale("uk")
            LanguageType.GREEK -> Locale("el")
            LanguageType.HEBREW -> Locale("he")
            LanguageType.TURKISH -> Locale("tr")
            LanguageType.VIETNAMESE -> Locale("vi")
            LanguageType.THAI -> Locale("th")
            LanguageType.BENGALI -> Locale("bn")
            LanguageType.TAMIL -> Locale("ta")
            LanguageType.TELUGU -> Locale("te")
            LanguageType.MARATHI -> Locale("mr")
            LanguageType.KANNADA -> Locale("kn")
            LanguageType.MALAYALAM -> Locale("ml")
            LanguageType.SWAHILI -> Locale("sw")
            LanguageType.FARSI -> Locale("fa")
            LanguageType.HINDUSTANI -> Locale("hi") // Using Hindi locale for Hindustani
            LanguageType.ENGLISH, null -> Locale.ENGLISH
        }
    }

    /**
     * Get localized label for a SkillLevel enum
     */
    fun getLocalizedSkillLevel(skillLevel: SkillLevel, languageType: LanguageType?): String {
        val locale = languageTypeToLocale(languageType)
        val key = "enum.skillLevel.${skillLevel.name}"
        return messageSource.getMessage(key, null, skillLevel.label, locale)
    }

    /**
     * Get localized label for an EducationDegree enum
     */
    fun getLocalizedEducationDegree(degree: EducationDegree, languageType: LanguageType?): String {
        val locale = languageTypeToLocale(languageType)
        val key = "enum.educationDegree.${degree.name}"
        return messageSource.getMessage(key, null, degree.label, locale)
    }
}
