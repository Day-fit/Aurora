package pl.dayfit.auroracore.service

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.event.EventListener
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.web.socket.TextMessage
import pl.dayfit.auroracore.dto.StatusChangedDto
import pl.dayfit.auroracore.dto.TrackerResponseDto
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
        val tracker = trackerRepository.save(
            ActionTracker(
                null,
                ownerId,
                TrackerStatus.STARTING,
                trackerType,
                trackedResourceId
            )
        )

        notifyUser(
            ownerId,
            objectMapper.writeValueAsString(
                StatusChangedDto(
                    tracker.id!!,
                    tracker.status,
                    tracker.type,
                    tracker.trackedResourceId
                )
            )
        )

        return tracker
    }

    /**
     * Handles the `StatusChangedEvent` by processing the event data, sending notifications,
     * and updating the relevant WebSocket sessions for the associated user.
     *
     * @param event the event containing information about the status change, including
     * the user ID, tracker ID, and the new tracker status.
     */
    @EventListener
    fun handleNotifying(event: StatusChangedEvent) {
        val trackerId = event.trackerId
        val trackerStatus = event.status

        val tracker = trackerRepository
            .findById(trackerId)
            .orElseThrow { NoSuchElementException("Tracker not found") }

        val message = StatusChangedDto(
            trackerId,
            trackerStatus,
            tracker.type,
            tracker.trackedResourceId
        )

        notifyUser(
            tracker.ownerId,
            objectMapper.writeValueAsString(message)
        )

        logger.trace("Notification sent. Id: {}, Status: {}", trackerId, trackerStatus)
    }

    /**
     * Handles the `StatusChangedEvent` by updating the status of the corresponding tracker in the repository.
     *
     * @param event the event containing the tracker ID and the new status to be applied.
     * It includes the following properties:
     * - `trackerId`: the unique identifier of the tracker to be updated.
     * - `status`: the new status to be set in the tracker.
     */
    @EventListener
    fun handleUpdatingStatus(event: StatusChangedEvent) {
        val tracker = trackerRepository.findById(event.trackerId)
            .orElseThrow { IllegalStateException("Tracker not found") }

        tracker.status = event.status

        trackerRepository.save(tracker)
    }

    fun getTrackedResourceId(trackingId: String, ownerId: UUID, expectedType: TrackerType): Any
    {
        val tracker = trackerRepository
            .findById(trackingId)
            .orElseThrow { NoSuchElementException("There is no tracker with given id") }

        if (tracker.ownerId != ownerId) {
            throw AccessDeniedException("You are not allowed to access this tracker")
        }

        if (tracker.type != expectedType) {
            throw IllegalStateException("Tracker type mismatch (Should not happen)")
        }

        return tracker.trackedResourceId
    }

    /**
     * Retrieves the identifier of the resource tracked by the specified tracker.
     * Should be used only in internal backend logic. Do not use it when a user is part of the request.
     *
     * @param trackingId the unique identifier of the tracker whose tracked resource ID is to be retrieved.
     * @param expectedType the expected type of the tracker. If the tracker type does not match this, an exception is thrown.
     * @return the identifier of the resource being tracked by the specified tracker.
     * @throws NoSuchElementException if a tracker with the given ID does not exist.
     * @throws IllegalStateException if the tracker type does not match the expected type.
     */
    fun getTrackedResourceId(trackingId: String, expectedType: TrackerType): Any
    {
        val tracker = trackerRepository
            .findById(trackingId)
            .orElseThrow { NoSuchElementException("There is no tracker with given id") }

        if (tracker.type != expectedType) {
            throw IllegalStateException("Tracker type mismatch (Should not happen)")
        }

        return tracker.trackedResourceId
    }
    
    fun getAllTrackers(ownerId: UUID): List<TrackerResponseDto>
    {
        return trackerRepository.findAllByOwnerId(ownerId)
            .map {
                TrackerResponseDto(
                    it.id!!,
                    it.status,
                    it.type
                )
            }
    }

    private fun notifyUser(userId: UUID, message: String) {
        val sessions = sessionService.getSessionByUserId(userId)

        sessions?.forEach {
            it.sendMessage(TextMessage(message))
        }
    }
}