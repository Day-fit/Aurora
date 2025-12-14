package pl.dayfit.auroracore.service.cache

import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.repository.ResumeRepository
import java.util.UUID

@Service
class ResumeCacheService(
    private val resumeRepository: ResumeRepository
) {
    @Cacheable("resume.id", key = "#id")
    fun getResumeById(id: UUID): Resume
    {
        return resumeRepository.findById(id)
            .orElseThrow{ NoSuchElementException("There is no resume with such a id") }
    }

    @CachePut("resume.id", key = "#resume.id")
    fun saveResume(resume: Resume): Resume
    {
        return resumeRepository.save(resume)
    }

    @CacheEvict("resume.id", key = "#id")
    fun deleteResume(id: UUID)
    {
        resumeRepository.deleteById(id)
    }
}