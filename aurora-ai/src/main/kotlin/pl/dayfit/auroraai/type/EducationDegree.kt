package pl.dayfit.auroraai.type

import com.fasterxml.jackson.annotation.JsonProperty

enum class EducationDegree(val label: String) {
    @JsonProperty("LOWER_SECONDARY_SCHOOL") LOWER_SECONDARY_SCHOOL("Lower secondary school"),
    @JsonProperty("UPPER_SECONDARY_SCHOOL") UPPER_SECONDARY_SCHOOL("Upper secondary school"),
    @JsonProperty("VOCATIONAL_SCHOOL") VOCATIONAL_SCHOOL("Vocational school"),
    @JsonProperty("HIGH_SCHOOL") HIGH_SCHOOL("High school"),
    @JsonProperty("TECHNICAL_COLLEGE") TECHNICAL_COLLEGE("Technical college"),
    @JsonProperty("COLLEGE") COLLEGE("College"),
    @JsonProperty("UNIVERSITY") UNIVERSITY("University"),
    @JsonProperty("ASSOCIATE_DEGREE") ASSOCIATE_DEGREE("Associate degree"),
    @JsonProperty("BACHELOR_DEGREE") BACHELOR_DEGREE("Bachelor's degree"),
    @JsonProperty("MASTER_DEGREE") MASTER_DEGREE("Master's degree"),
    @JsonProperty("DOCTORAL_DEGREE") DOCTORAL_DEGREE("Doctoral degree"),
    @JsonProperty("POSTDOCTORAL") POSTDOCTORAL("Postdoctoral"),
    @JsonProperty("PROFESSIONAL_CERTIFICATE") PROFESSIONAL_CERTIFICATE("Professional certificate"),
    @JsonProperty("OTHER") OTHER("Other");

    override fun toString(): String = label
}
