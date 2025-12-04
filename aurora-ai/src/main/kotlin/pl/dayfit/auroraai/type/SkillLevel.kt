package pl.dayfit.auroraai.type

import com.fasterxml.jackson.annotation.JsonProperty

enum class SkillLevel(val label: String) {
    @JsonProperty("BEGINNER") BEGINNER("Beginner"),
    @JsonProperty("INTERMEDIATE") INTERMEDIATE("Intermediate"),
    @JsonProperty("ADVANCED") ADVANCED("Advanced"),
    @JsonProperty("EXPERT") EXPERT("Expert"),
    @JsonProperty("MASTER") MASTER("Master");

    override fun toString(): String = label
}