package pl.dayfit.auroracore.repository.redis

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import pl.dayfit.auroracore.model.redis.ActionTracker
import java.util.UUID

@Repository
interface TrackerRepository : CrudRepository<ActionTracker, String> {
    fun findAllByOwnerId(ownerId: UUID): MutableList<ActionTracker>
}