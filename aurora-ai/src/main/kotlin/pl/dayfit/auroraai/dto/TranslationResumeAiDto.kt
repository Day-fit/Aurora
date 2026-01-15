package pl.dayfit.auroraai.dto

data class TranslationResumeAiDto (
    val title: String,
    val description: String?,
    val achievementsTitles: List<String>,
    val achievementsDescriptions: List<String>,

    val skillsNames: List<String>,

    val educationMajors: List<String>,

    val experiencePositions: List<String>,
    val experienceDescriptions: List<String>
)