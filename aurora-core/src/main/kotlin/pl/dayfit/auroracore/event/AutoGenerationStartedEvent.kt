package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.type.AutoGenerationSource
import java.util.UUID

data class AutoGenerationStartedEvent(
    val id: String,
    val userId: UUID,
    val name: String,
    val title: String,
    val source: AutoGenerationSource
)