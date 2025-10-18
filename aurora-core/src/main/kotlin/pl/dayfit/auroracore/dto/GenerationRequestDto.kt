package pl.dayfit.auroracore.dto

import pl.dayfit.auroracore.type.EducationTypes

data class GenerationRequestDto (
    var name: String?,
    var surname: String?,
    var age: Int?,
    var experience: String?,
    var skills: List<String>,
    var education: EducationTypes?,
    var photo: String?,
    var description: String?
)