package pl.dayfit.auroracore.repository.redis

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import pl.dayfit.auroracore.model.redis.ActionTracker

@Repository
interface TrackerRepository : CrudRepository<ActionTracker, String>