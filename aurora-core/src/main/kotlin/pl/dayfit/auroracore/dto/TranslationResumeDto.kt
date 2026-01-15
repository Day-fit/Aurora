package pl.dayfit.auroracore.dto

import java.util.UUID

data class TranslationResumeDto(
    val id: UUID,
    val title: String,
    val description: String?,
    val achievementsTitles: List<String>,
    val achievementsDescriptions: List<String>,

    val skillsNames: List<String>,
    val skillsLevels: List<String>,

    val educationMajors: List<String>,
    val educationDegrees: List<String>,

    val experiencePositions: List<String>,
    val experienceDescriptions: List<String>
)