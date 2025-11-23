package pl.dayfit.auroracore.dto

data class InformationDto (
    val description: String,
    val helpers: List<InformationItem> //e. g repos from GitHub
) {
    data class InformationItem(
        val name: String,
        val value: String
    )
}