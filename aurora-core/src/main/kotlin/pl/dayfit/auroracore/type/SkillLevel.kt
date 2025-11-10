package pl.dayfit.auroracore.type

enum class SkillLevel(val label: String) {
    BEGINNER("Beginner"),
    INTERMEDIATE("Intermediate"),
    ADVANCED("Advanced"),
    EXPERT("Expert"),
    MASTER("Master");

    override fun toString(): String {
        return label
    }
}