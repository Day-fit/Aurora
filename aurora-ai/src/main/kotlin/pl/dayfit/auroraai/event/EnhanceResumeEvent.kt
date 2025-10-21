package pl.dayfit.auroraai.event

data class EnhanceResumeEvent(
    val title: String,
    val description: String?,
    val achievementDescriptions: List<String>,
    val skillsNames: List<String>
)
