package pl.dayfit.auroracore.helper

import org.springframework.stereotype.Component
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import java.util.UUID

@Component
class AccessHelper(
    private val resumeCacheService: ResumeCacheService
) {
    /**
     * Determines if the specified user is the owner of the given résumé.
     *
     * @param resume the résumé to check ownership for
     * @param userId the ID of the user to be verified as the owner
     * @return true if the specified user is the owner of the résumé, false otherwise
     */
    fun isOwner(resume: Resume, userId: UUID) = resume.auroraUserId == userId
    fun isOwner(resumeId: UUID, userId: UUID) = isOwner(
        resumeCacheService.getResumeById(resumeId),
        userId
    )
}