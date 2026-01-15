package pl.dayfit.auroraai.event

import java.util.UUID

data class EnhanceRequestedEvent(
    val id: UUID,
    val trackerId: String,
    val title: String,
    val description: String?,
    val achievementDescriptions: List<String>,
    val skillsNames: List<String>
)
