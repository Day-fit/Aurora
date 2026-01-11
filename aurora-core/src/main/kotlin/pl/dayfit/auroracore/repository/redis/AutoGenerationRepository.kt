package pl.dayfit.auroracore.repository.redis

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import pl.dayfit.auroracore.model.redis.AutoGenerationData

@Repository
interface AutoGenerationRepository : CrudRepository<AutoGenerationData, String>