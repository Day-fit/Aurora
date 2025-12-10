package pl.dayfit.auroracore.repository.redis

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import pl.dayfit.auroracore.model.redis.AutoGenerationTracker

@Repository
interface AutoGenerationTrackerRepository : CrudRepository<AutoGenerationTracker, String>