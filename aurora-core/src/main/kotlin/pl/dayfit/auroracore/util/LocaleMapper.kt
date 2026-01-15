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
            LanguageType.SPANISH -> Locale("es")
            LanguageType.FRENCH -> Locale("fr")
            LanguageType.GERMAN -> Locale("de")
            LanguageType.ITALIAN -> Locale("it")
            LanguageType.PORTUGUESE -> Locale("pt")
            LanguageType.RUSSIAN -> Locale("ru")
            LanguageType.MANDARIN -> Locale("zh")
            LanguageType.JAPANESE -> Locale("ja")
            LanguageType.KOREAN -> Locale("ko")
            LanguageType.ARABIC -> Locale("ar")
            LanguageType.HINDI -> Locale("hi")
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
}
