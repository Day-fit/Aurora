package pl.dayfit.auroracore.type

enum class EducationDegree(val label: String) {
    LOWER_SECONDARY_SCHOOL("Lower secondary school"),
    UPPER_SECONDARY_SCHOOL("Upper secondary school"),
    VOCATIONAL_SCHOOL("Vocational school"),
    HIGH_SCHOOL("High school"),
    TECHNICAL_COLLEGE("Technical college"),
    COLLEGE("College"),
    UNIVERSITY("University"),
    ASSOCIATE_DEGREE("Associate degree"),
    BACHELOR_DEGREE("Bachelor degree"),
    MASTER_DEGREE("Master degree"),
    DOCTORAL_DEGREE("Doctoral degree"),
    POSTDOCTORAL("Postdoctoral"),
    PROFESSIONAL_CERTIFICATE("Professional certificate"),
    OTHER("Other");

    override fun toString(): String {
        return label
    }
}