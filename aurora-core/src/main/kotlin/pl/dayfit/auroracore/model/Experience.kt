package pl.dayfit.auroracore.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant

@Entity
class Experience(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    var company: String,
    var position: String,
    var startDate: Instant,
    var endDate: Instant? = null,
    var description: String? = null,
)