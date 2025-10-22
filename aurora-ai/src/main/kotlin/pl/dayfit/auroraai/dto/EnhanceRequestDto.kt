package pl.dayfit.auroraai.dto

data class EnhanceRequestDto(
    val newTitle: String,
    val newDescription: String?,
    val newAchievementDescriptions: List<String>,
    val newSkillsNames: List<String>
)