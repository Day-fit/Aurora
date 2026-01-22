package pl.dayfit.auroracore.service.cache

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.cache.annotation.Caching
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.repository.ResumeRepository
import java.util.*

@Service
class ResumeCacheService(
    private val resumeRepository: ResumeRepository,
    private val cacheManager: CacheManager,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    @Cacheable("resume.id", key = "#id")
    fun getResumeById(id: UUID): Resume {
        return resumeRepository.findById(id)
            .orElseThrow { NoSuchElementException("There is no resume with such a id") }
    }

    @Cacheable("resumes.ownerId", key = "#userId")
    fun getAllResumesByOwnerId(userId: UUID): List<Resume>
    {
        return resumeRepository
            .findAllByAuroraUserId(userId)
    }

    @Caching(
        put = [CachePut("resume.id", key = "#resume.id")],
        evict = [CacheEvict("resumes.ownerId", key = "#resume.auroraUserId")]
    )
    fun saveResume(resume: Resume): Resume
    {
        return resumeRepository
            .save(resume)
    }

    fun deleteResume(id: UUID)
    {
        val resume = resumeRepository.findById(id)
            .orElseThrow { NoSuchElementException("There is no resume with such a id") }

        cacheManager.getCache("resume.id")
            ?.evict(id)

        val resumes = jacksonObjectMapper().convertValue<List<Resume>>(
            redisTemplate.opsForValue()
                .get("resumes.ownerId:${resume.auroraUserId}") ?: emptyList<Resume>()
        )

        cacheManager.getCache("resumes.ownerId")?.put(
            resume.auroraUserId,
            resumes.filter { it.id != id }
                .toList()
        )

        resumeRepository
            .deleteById(id)
    }
}