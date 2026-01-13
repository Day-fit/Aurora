package pl.dayfit.auroracore.helper

import org.springframework.stereotype.Component
import pl.dayfit.auroracore.model.Resume
import java.util.UUID

@Component
class AccessHelper {
    /**
     * Determines if the specified user is the owner of the given résumé.
     *
     * @param resume the résumé to check ownership for
     * @param userId the ID of the user to be verified as the owner
     * @return true if the specified user is the owner of the résumé, false otherwise
     */
    fun isOwner(resume: Resume, userId: UUID) = resume.auroraUserId == userId
}