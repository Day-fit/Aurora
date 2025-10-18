package pl.dayfit.auroracore.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import pl.dayfit.auroracore.type.EducationTypes
import java.util.UUID

@Entity
data class Resume(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID?,
    var userId: UUID,

    var name: String,
    var surname: String,
    var age: Int,
    var experience: String,
    var skills: List<String>,
    var education: EducationTypes,
    var photo: ByteArray,
    var description: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Resume

        if (age != other.age) return false
        if (name != other.name) return false
        if (surname != other.surname) return false
        if (experience != other.experience) return false
        if (skills != other.skills) return false
        if (education != other.education) return false
        if (!photo.contentEquals(other.photo)) return false
        if (description != other.description) return false

        return true
    }

    override fun hashCode(): Int {
        var result = age
        result = 31 * result + (id?.hashCode() ?: 0)
        result = 31 * result + userId.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + surname.hashCode()
        result = 31 * result + experience.hashCode()
        result = 31 * result + skills.hashCode()
        result = 31 * result + education.hashCode()
        result = 31 * result + photo.contentHashCode()
        result = 31 * result + description.hashCode()
        return result
    }
}
