package pl.dayfit.auroraai.type

enum class AutoGenerationSource(val label: String) {
    GITHUB("GitHub");

    override fun toString(): String {
        return label
    }
}