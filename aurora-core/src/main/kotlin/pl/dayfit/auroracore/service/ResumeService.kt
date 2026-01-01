package pl.dayfit.auroracore.service

import org.springframework.stereotype.Service
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import java.util.UUID

@Service
class ResumeService(
    private val resumeCacheService: ResumeCacheService,
) {
    /**
     * Retrieves all resume IDs associated with the specified user.
     *
     * @param userId the unique identifier of the user whose resumes are to be retrieved
     * @return a list of resume IDs belonging to the specified user
     */
    fun findAllResumes(userId: UUID): List<UUID>
    {
        return resumeCacheService
            .getAllResumesByOwnerId(userId)
            .map{resume -> resume.id!!}
    }
}