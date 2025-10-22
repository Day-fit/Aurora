package pl.dayfit.auroraai.event

import java.util.UUID

data class EnhanceDoneEvent (
    val id: UUID,
    val newTitle: String,
    val newDescription: String?,
    val newAchievementDescriptions: List<String>,
    val newSkillsNames: List<String>
)