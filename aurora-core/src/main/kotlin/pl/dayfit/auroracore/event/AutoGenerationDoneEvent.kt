package pl.dayfit.auroracore.event

import pl.dayfit.auroracore.model.redis.AutoGenerationData

data class AutoGenerationDoneEvent(
    val trackerId: String,
    val result: AutoGenerationData
)
