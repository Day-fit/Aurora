package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.type.AutoGenerationSource

data class TrackerWaitingToStartEvent (
    val id: String,
    val name: String,
    val title: String,
    val source: AutoGenerationSource
)