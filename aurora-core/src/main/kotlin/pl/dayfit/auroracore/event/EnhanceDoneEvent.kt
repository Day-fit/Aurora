package pl.dayfit.auroracore.event

import java.util.UUID

data class EnhanceDoneEvent (
    val id: UUID,
    val trackerId: String,
    val newTitle: String,
    val newDescription: String?,
    val newAchievementDescriptions: List<String>,
    val newSkillsNames: List<String>
)