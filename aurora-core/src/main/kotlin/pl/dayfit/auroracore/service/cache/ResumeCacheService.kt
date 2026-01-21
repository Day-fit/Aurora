package pl.dayfit.auroracore.service.cache

import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.cache.annotation.Caching
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.repository.ResumeRepository
import java.util.UUID

@Service
class ResumeCacheService(
    private val resumeRepository: ResumeRepository,
    private val cacheManager: CacheManager
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

    @Suppress("unused")
    fun deleteResume(id: UUID)
    {
        cacheManager.getCache("resume.id")
        //TODO: when adding removing functionality, please implement "resumes.ownerId" cache evict
        resumeRepository
            .deleteById(id)
    }
}