package pl.dayfit.auroracore.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.AutoGenerationDoneEvent
import pl.dayfit.auroracore.repository.redis.AutoGenerationTrackerRepository
import pl.dayfit.auroracore.type.TrackerStatus

/**
 * Service responsible for integration with auto-generation (AI microservice).
 * Service handles incoming messages from the stream and saves responses to trackers.
 */
@Service
class AutoGenerationIntegrationService(
    streamsEnvironment: Environment,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val autoGenerationTrackerRepository: AutoGenerationTrackerRepository
) {
    init {
        streamsEnvironment.consumerBuilder()
            .stream("post.autogeneration.stream")
            .offset(OffsetSpecification.next())
            .messageHandler { _, record ->
                val json = String(record.bodyAsBinary, Charsets.UTF_8)
                applicationEventPublisher.publishEvent(
                    jacksonObjectMapper()
                        .readValue(json, AutoGenerationDoneEvent::class.java)
                )
            }
            .build()
    }

    @EventListener
    fun handleAutoGeneration(event: AutoGenerationDoneEvent) {
        val tracker = autoGenerationTrackerRepository
            .findById(event.trackerId)
            .orElseThrow { NoSuchElementException("Tracker not found") }

        tracker.status = TrackerStatus.DONE
        tracker.result = event.result
        autoGenerationTrackerRepository.save(tracker)
    }
}