package pl.dayfit.auroracore.service

import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.InformationDto
import pl.dayfit.auroracore.event.AutoGenerationRequestedEvent
import pl.dayfit.auroracore.event.AutoGenerationStartedEvent
import pl.dayfit.auroracore.event.StatusChangedEvent
import pl.dayfit.auroracore.information.InformationWorker
import pl.dayfit.auroracore.repository.redis.TrackerRepository
import pl.dayfit.auroracore.type.AutoGenerationSource
import pl.dayfit.auroracore.type.TrackerStatus
import java.util.UUID

/**
 * Service responsible for searching for information in a given source
 * Notifies about the status change of the tracker
 */
@Service
class InformationManagerService(
    private val workers: List<InformationWorker>,
    private val trackerRepository: TrackerRepository,
    private val autoGenerationStreamTemplate: RabbitStreamTemplate,
    private val applicationEventPublisher: ApplicationEventPublisher
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(InformationManagerService::class.java)

    /**
     * Collects required information based on the given event data and sends it for processing.
     * Updates the tracker status throughout the process and handles potential errors.
     *
     * @param event The event containing details of the auto-generation operation, including the tracker ID,
     * user ID, source, and name to resolve the required information.
     */
    @Async
    @EventListener
    fun collectAndSendInformation(event: AutoGenerationStartedEvent)
    {
        val tracker = trackerRepository
            .findById(event.id)
            .orElseThrow { IllegalStateException("Tracker not found, id ${event.id}") }

        tracker.status = TrackerStatus.SEARCHING_INFORMATION

        val information = runCatching {
            handleCollectingInformation(
                event.name,
                event.source
            )
        }

        if (information.isFailure){
            tracker.status = TrackerStatus.FAILED
            trackerRepository.save(tracker)
            handleStatusChanged(event.id, event.userId, tracker.status)
            logger.error("Failed to collect information for ${event.name} from ${event.source}, id ${event.id}", information.exceptionOrNull())
            return
        }

        trackerRepository.save(tracker)
        handleStatusChanged(event.id, event.userId, tracker.status)

        autoGenerationStreamTemplate.convertAndSend(
            AutoGenerationRequestedEvent(
                event.id,
                event.title,
                event.source,
                information.getOrThrow()
            )
        )

        tracker.status = TrackerStatus.PROCESSING_INFORMATION
        trackerRepository.save(tracker)
        handleStatusChanged(event.id, event.userId, tracker.status)
    }

    private fun handleCollectingInformation(name: String, source: AutoGenerationSource): InformationDto
    {
        return workers.find { worker -> worker.supports(source) }
            ?.processInformation(name)
            ?: throw IllegalStateException("No worker found for source $source")
    }

    private fun handleStatusChanged(id: String, userId: UUID, status: TrackerStatus)
    {
        applicationEventPublisher
            .publishEvent(
                StatusChangedEvent(
                    userId,
                    id,
                    status
                )
            )
    }
}