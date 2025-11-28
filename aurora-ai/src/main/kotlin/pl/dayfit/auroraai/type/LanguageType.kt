package pl.dayfit.auroraai.type

/**
 * Enum representing languages relevant for CV translation.
 * Each value stores a readable `label`, and `toString()` returns that label.
 */
enum class LanguageType(val label: String) {
    DUTCH("Dutch"),
    SWEDISH("Swedish"),
    DANISH("Danish"),
    NORWEGIAN("Norwegian"),
    POLISH("Polish"),
    CZECH("Czech"),
    SLOVAK("Slovak"),
    ROMANIAN("Romanian"),
    HUNGARIAN("Hungarian"),
    UKRAINIAN("Ukrainian"),
    GREEK("Greek"),
    HEBREW("Hebrew"),
    GERMAN("German"),
    TURKISH("Turkish"),
    ITALIAN("Italian"),
    FARSI("Farsi (Persian/Dari)"),
    SWAHILI("Swahili"),
    TAMIL("Tamil"),
    TELUGU("Telugu"),
    MARATHI("Marathi"),
    KANNADA("Kannada"),
    MALAYALAM("Malayalam"),
    KOREAN("Korean"),
    VIETNAMESE("Vietnamese"),
    THAI("Thai"),
    MANDARIN("Mandarin"),
    ENGLISH("English"),
    SPANISH("Spanish"),
    HINDUSTANI("Hindustani (Hindi/Urdu)"),
    ARABIC("Arabic"),
    BENGALI("Bengali"),
    PORTUGUESE("Portuguese"),
    RUSSIAN("Russian"),
    FRENCH("French");

    override fun toString(): String = label
}
