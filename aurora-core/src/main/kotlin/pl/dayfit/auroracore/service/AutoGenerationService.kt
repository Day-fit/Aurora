package pl.dayfit.auroracore.service

import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.AutoGenerationDto
import pl.dayfit.auroracore.event.StatusChangedEvent
import pl.dayfit.auroracore.event.TrackerWaitingToStartEvent
import pl.dayfit.auroracore.exception.AutoGenerationFailedException
import pl.dayfit.auroracore.exception.ResourceNotReadyYetException
import pl.dayfit.auroracore.model.redis.AutoGenerationTracker
import pl.dayfit.auroracore.repository.redis.AutoGenerationTrackerRepository
import pl.dayfit.auroracore.type.AutoGenerationSource
import pl.dayfit.auroracore.type.TrackerStatus
import java.util.UUID

@Service
class AutoGenerationService(
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val autoGenerationTrackerRepository: AutoGenerationTrackerRepository,
) {
    /**
     * Puts a request in processing queue
     */
    fun requestAutoGeneration(title: String, name: String, source: AutoGenerationSource, ownerId: UUID): String {
        val tracker = AutoGenerationTracker(
            null,
            ownerId,
            TrackerStatus.STARTING,
            null
        )

        val saved = autoGenerationTrackerRepository
            .save(tracker)

        val id = saved.id!!

        applicationEventPublisher
            .publishEvent(
                StatusChangedEvent(
                    ownerId,
                    id,
                    saved.status,
                )
            )

        applicationEventPublisher
            .publishEvent(
                TrackerWaitingToStartEvent(
                    id,
                    ownerId,
                    name,
                    title,
                    source
                )
            )

        return id
    }

    /**
     * Tries to get a result from a tracker with tracker id
     * @throws NoSuchElementException when tracker with given id does not exist
     * @throws ResourceNotReadyYetException when the tracker result is null
     * @return Auto generation result
     */
    @Throws(NoSuchElementException::class, ResourceNotReadyYetException::class)
    fun getAutoGenerationResult(trackerId: String): AutoGenerationDto {
        val tracker = autoGenerationTrackerRepository
            .findById(trackerId)
            .orElseThrow{ NoSuchElementException("No tracker with id $trackerId") }

        if (tracker.status == TrackerStatus.FAILED)
        {
            throw AutoGenerationFailedException("Auto generation failed for tracker with id $trackerId. Please try again later.")
        }

        if (tracker.result == null)
        {
            throw ResourceNotReadyYetException("Tracker with id $trackerId is not ready yet")
        }

        return tracker.result!!
    }
}