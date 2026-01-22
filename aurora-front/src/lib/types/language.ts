// Language types matching backend LanguageType enum in core/types/LanguageType.kt
export type LanguageType =
  | "DUTCH"
  | "SWEDISH"
  | "DANISH"
  | "NORWEGIAN"
  | "POLISH"
  | "CZECH"
  | "SLOVAK"
  | "ROMANIAN"
  | "HUNGARIAN"
  | "UKRAINIAN"
  | "GREEK"
  | "HEBREW"
  | "GERMAN"
  | "TURKISH"
  | "ITALIAN"
  | "FARSI"
  | "SWAHILI"
  | "TAMIL"
  | "TELUGU"
  | "MARATHI"
  | "KANNADA"
  | "MALAYALAM"
  | "KOREAN"
  | "VIETNAMESE"
  | "THAI"
  | "MANDARIN"
  | "JAPANESE"
  | "ENGLISH"
  | "SPANISH"
  | "HINDI"
  | "HINDUSTANI"
  | "ARABIC"
  | "BENGALI"
  | "PORTUGUESE"
  | "RUSSIAN"
  | "FRENCH";

// Human-readable labels for each language (matching backend LanguageType.kt labels)
export const LANGUAGE_LABELS: Record<LanguageType, string> = {
  DUTCH: "Dutch",
  SWEDISH: "Swedish",
  DANISH: "Danish",
  NORWEGIAN: "Norwegian",
  POLISH: "Polish",
  CZECH: "Czech",
  SLOVAK: "Slovak",
  ROMANIAN: "Romanian",
  HUNGARIAN: "Hungarian",
  UKRAINIAN: "Ukrainian",
  GREEK: "Greek",
  HEBREW: "Hebrew",
  GERMAN: "German",
  TURKISH: "Turkish",
  ITALIAN: "Italian",
  FARSI: "Farsi (Persian/Dari)",
  SWAHILI: "Swahili",
  TAMIL: "Tamil",
  TELUGU: "Telugu",
  MARATHI: "Marathi",
  KANNADA: "Kannada",
  MALAYALAM: "Malayalam",
  KOREAN: "Korean",
  VIETNAMESE: "Vietnamese",
  THAI: "Thai",
  MANDARIN: "Mandarin",
  JAPANESE: "Japanese",
  ENGLISH: "English",
  SPANISH: "Spanish",
  HINDI: "Hindi",
  HINDUSTANI: "Hindustani (Hindi/Urdu)",
  ARABIC: "Arabic",
  BENGALI: "Bengali",
  PORTUGUESE: "Portuguese",
  RUSSIAN: "Russian",
  FRENCH: "French",
};

// Flag emoji for common languages (optional visual enhancement)
export const LANGUAGE_FLAGS: Partial<Record<LanguageType, string>> = {
  ENGLISH: "🇬🇧",
  POLISH: "🇵🇱",
  GERMAN: "🇩🇪",
  FRENCH: "🇫🇷",
  SPANISH: "🇪🇸",
  ITALIAN: "🇮🇹",
  PORTUGUESE: "🇵🇹",
  DUTCH: "🇳🇱",
  RUSSIAN: "🇷🇺",
  JAPANESE: "🇯🇵",
  KOREAN: "🇰🇷",
  ARABIC: "🇸🇦",
  HINDI: "🇮🇳",
  TURKISH: "🇹🇷",
  SWEDISH: "🇸🇪",
  NORWEGIAN: "🇳🇴",
  DANISH: "🇩🇰",
  CZECH: "🇨🇿",
  UKRAINIAN: "🇺🇦",
  GREEK: "🇬🇷",
  HUNGARIAN: "🇭🇺",
  ROMANIAN: "🇷🇴",
  MANDARIN: "🇨🇳",
  HEBREW: "🇮🇱",
  THAI: "🇹🇭",
  VIETNAMESE: "🇻🇳",
  BENGALI: "🇧🇩",
  TAMIL: "🇮🇳",
  SLOVAK: "🇸🇰",
};

// All languages matching backend LanguageType.kt
export const ALL_LANGUAGES: LanguageType[] = [
  "DUTCH",
  "SWEDISH",
  "DANISH",
  "NORWEGIAN",
  "POLISH",
  "CZECH",
  "SLOVAK",
  "ROMANIAN",
  "HUNGARIAN",
  "UKRAINIAN",
  "GREEK",
  "HEBREW",
  "GERMAN",
  "TURKISH",
  "ITALIAN",
  "FARSI",
  "SWAHILI",
  "TAMIL",
  "TELUGU",
  "MARATHI",
  "KANNADA",
  "MALAYALAM",
  "KOREAN",
  "VIETNAMESE",
  "THAI",
  "MANDARIN",
  "JAPANESE",
  "ENGLISH",
  "SPANISH",
  "HINDI",
  "HINDUSTANI",
  "ARABIC",
  "BENGALI",
  "PORTUGUESE",
  "RUSSIAN",
  "FRENCH",
];
