package pl.dayfit.auroraai.event

import pl.dayfit.auroraai.type.AutoGenerationSource

data class AutoGenerationRequestedEvent(
    val title: String, //for better understanding
    val source: AutoGenerationSource,
    val description: String,
    val helpers: List<HelperObject> //e. g repos from GitHub
) {
    data class HelperObject(
        val name: String,
        val value: String
    )
}