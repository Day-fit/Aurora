package pl.dayfit.auroracore.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PreDestroy
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.AutoGenerationDoneEvent
import pl.dayfit.auroracore.event.StatusChangedEvent
import pl.dayfit.auroracore.repository.redis.TrackerRepository
import pl.dayfit.auroracore.type.TrackerStatus

/**
 * Service responsible for integration with auto-generation (AI microservice).
 * Service handles incoming messages from the stream and saves responses to trackers.
 */
@Service
class AutoGenerationIntegrationService(
    streamsEnvironment: Environment,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val trackerRepository: TrackerRepository,
    private val rabbitObjectMapper: ObjectMapper
) {
    private val consumer = streamsEnvironment.consumerBuilder()
        .stream("post.autogeneration.stream")
        .offset(OffsetSpecification.next())
        .messageHandler { _, record ->
            val json = String(record.bodyAsBinary, Charsets.UTF_8)
            applicationEventPublisher.publishEvent(
                rabbitObjectMapper
                    .readValue(json, AutoGenerationDoneEvent::class.java)
            )
        }
        .build()

    @PreDestroy
    private fun destroy() {
        consumer.close()
    }

    @EventListener
    fun handleAutoGeneration(event: AutoGenerationDoneEvent) {
        val tracker = trackerRepository
            .findById(event.trackerId)
            .orElseThrow { NoSuchElementException("Tracker not found") }

        tracker.status = TrackerStatus.DONE
        trackerRepository.save(tracker)

        applicationEventPublisher
            .publishEvent(
                StatusChangedEvent(
                    tracker.ownerId,
                    tracker.id!!,
                    tracker.status
                )
            )
    }
}