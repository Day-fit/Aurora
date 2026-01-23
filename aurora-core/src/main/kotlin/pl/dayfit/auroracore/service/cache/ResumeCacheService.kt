package pl.dayfit.auroracore.service.cache

import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.cache.annotation.Caching
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.repository.ResumeRepository
import java.util.*

@Service
class ResumeCacheService(
    private val resumeRepository: ResumeRepository,
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

    @Caching(
        evict = [
            CacheEvict(cacheNames = ["resume.id"], key = "#id"),
            CacheEvict(cacheNames = ["resumes.ownerId"], key = "#result")
        ]
    )
    fun deleteResume(id: UUID): UUID {
        val resume = resumeRepository.findById(id)
            .orElseThrow { NoSuchElementException("There is no resume with such an id") }

        resumeRepository.deleteById(id)
        return resume.auroraUserId
    }
}