package pl.dayfit.auroracore.util

import pl.dayfit.auroracore.type.LanguageType
import java.util.Locale

/**
 * Utility object for mapping LanguageType to Java Locale
 */
object LocaleMapper {
    /**
     * Convert a LanguageType enum to the corresponding Java Locale
     */
    fun toLocale(languageType: LanguageType?): Locale {
        return when (languageType) {
            LanguageType.SPANISH -> Locale.of("es")
            LanguageType.FRENCH -> Locale.of("fr")
            LanguageType.GERMAN -> Locale.of("de")
            LanguageType.ITALIAN -> Locale.of("it")
            LanguageType.PORTUGUESE -> Locale.of("pt")
            LanguageType.RUSSIAN -> Locale.of("ru")
            LanguageType.MANDARIN -> Locale.of("zh")
            LanguageType.JAPANESE -> Locale.of("ja")
            LanguageType.KOREAN -> Locale.of("ko")
            LanguageType.ARABIC -> Locale.of("ar")
            LanguageType.HINDI -> Locale.of("hi")
            LanguageType.POLISH -> Locale.of("pl")
            LanguageType.DUTCH -> Locale.of("nl")
            LanguageType.SWEDISH -> Locale.of("sv")
            LanguageType.DANISH -> Locale.of("da")
            LanguageType.NORWEGIAN -> Locale.of("no")
            LanguageType.CZECH -> Locale.of("cs")
            LanguageType.SLOVAK -> Locale.of("sk")
            LanguageType.ROMANIAN -> Locale.of("ro")
            LanguageType.HUNGARIAN -> Locale.of("hu")
            LanguageType.UKRAINIAN -> Locale.of("uk")
            LanguageType.GREEK -> Locale.of("el")
            LanguageType.HEBREW -> Locale.of("he")
            LanguageType.TURKISH -> Locale.of("tr")
            LanguageType.VIETNAMESE -> Locale.of("vi")
            LanguageType.THAI -> Locale.of("th")
            LanguageType.BENGALI -> Locale.of("bn")
            LanguageType.TAMIL -> Locale.of("ta")
            LanguageType.TELUGU -> Locale.of("te")
            LanguageType.MARATHI -> Locale.of("mr")
            LanguageType.KANNADA -> Locale.of("kn")
            LanguageType.MALAYALAM -> Locale.of("ml")
            LanguageType.SWAHILI -> Locale.of("sw")
            LanguageType.FARSI -> Locale.of("fa")
            LanguageType.HINDUSTANI -> Locale.of("hi") // Using Hindi locale for Hindustani
            LanguageType.ENGLISH, null -> Locale.ENGLISH
        }
    }
}
