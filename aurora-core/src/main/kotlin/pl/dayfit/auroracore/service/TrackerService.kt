package pl.dayfit.auroracore.service

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.event.EventListener
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.web.socket.TextMessage
import pl.dayfit.auroracore.dto.StatusChangedDto
import pl.dayfit.auroracore.event.StatusChangedEvent
import pl.dayfit.auroracore.model.redis.ActionTracker
import pl.dayfit.auroracore.repository.redis.TrackerRepository
import pl.dayfit.auroracore.type.TrackerStatus
import pl.dayfit.auroracore.type.TrackerType
import java.util.UUID

@Service
class TrackerService(
    private val sessionService: SessionService,
    private val trackerRepository: TrackerRepository,
    private val objectMapper: ObjectMapper
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    /**
     * Creates and saves a new action tracker for the specified owner and tracker type.
     *
     * @param ownerId the unique identifier of the owner for whom the tracker is created.
     * @param trackerType the type of tracker to be created, defining its purpose or functionality.
     * @return the newly created and saved ActionTracker instance.
     */
    fun createNewTracker(ownerId: UUID, trackerType: TrackerType, trackedResourceId: Any): ActionTracker
    {
        return trackerRepository.save(
            ActionTracker(
                null,
                ownerId,
                TrackerStatus.STARTING,
                trackerType,
                trackedResourceId
            )
        )
    }

    /**
     * Handles the `StatusChangedEvent` by processing the event data, sending notifications,
     * and updating the relevant WebSocket sessions for the associated user.
     *
     * @param event the event containing information about the status change, including
     * the user ID, tracker ID, and the new tracker status.
     */
    @EventListener
    fun handleUpdatingAndNotifying(event: StatusChangedEvent) {
        val trackerId = event.trackerId
        val trackerStatus = event.status

        val message = StatusChangedDto(
            trackerId,
            trackerStatus
        )

        val sessions = sessionService.getSessionByUserId(event.userId)

        if (sessions == null) {
            logger.debug("No session found for user with id {}", event.userId)
            return
        }

        sessions.forEach { it.sendMessage(
            TextMessage(
                objectMapper
                    .writeValueAsString(message)
            )
        ) }

        logger.trace("Notification sent. Id: {}, Status: {}", trackerId, trackerStatus)
    }

    fun getTrackedResourceId(trackingId: String, ownerId: UUID, expectedType: TrackerType): Any
    {
        val tracker = trackerRepository
            .findById(trackingId)
            .orElseThrow { NoSuchElementException("There is no tracker with such a id") }

        if (tracker.ownerId != ownerId) {
            throw AccessDeniedException("You are not allowed to access this tracker")
        }

        if (tracker.type != expectedType) {
            throw IllegalStateException("Tracker type mismatch (Should not happen)")
        }

        return tracker.trackedResourceId
    }
}