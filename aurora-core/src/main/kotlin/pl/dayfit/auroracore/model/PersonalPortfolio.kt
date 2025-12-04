package pl.dayfit.auroracore.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.util.UUID

@Entity
data class PersonalPortfolio (
    @Id
    @GeneratedValue(GenerationType.UUID)
    var id: UUID?,
    val name: String,
    val description: String
)