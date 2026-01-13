package pl.dayfit.auroracore.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PreDestroy
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.EnhanceDoneEvent
import pl.dayfit.auroracore.event.EnhanceRequestedEvent
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.event.StatusChangedEvent
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import pl.dayfit.auroracore.type.TrackerStatus
import pl.dayfit.auroracore.type.TrackerType
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.UUID

@Service
class EnhancementService(
    private val resumeCacheService: ResumeCacheService,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val enhancementStreamTemplate: RabbitStreamTemplate,
    private val trackerService: TrackerService,
    streamsEnvironment: Environment,

) {
    private val consumer = streamsEnvironment.consumerBuilder()
        .stream("post.enhancement.stream")
        .offset(OffsetSpecification.next())
        .messageHandler { _, record ->
            run {
                val json = String(record.bodyAsBinary, StandardCharsets.UTF_8)

                applicationEventPublisher.publishEvent(
                    jacksonObjectMapper()
                        .readValue(json, EnhanceDoneEvent::class.java)
                )
            }
        }
        .build()

    @PreDestroy
    private fun destroy() {
        consumer.close()
    }

    /**
     * Handles the completion of the resume enhancement process. Updates the resume details with enhanced
     * information provided in the event and caches the updated résumé. After updating, publishes an event
     * indicating that the résumé is ready for export.
     *
     * @param event The `EnhanceDoneEvent` object containing enhanced details for the résumé, including
     *  - `id`: The unique identifier of the résumé to be updated.
     *  - `newTitle`: The updated title for the résumé.
     *  - `newDescription`: The updated profile description for the résumé.
     *  - `newAchievementDescriptions`: A list of updated descriptions for the résumé's achievements.
     *  - `newSkillsNames`: A list of updated names for the résumé's skills.
     */
    @EventListener
    fun handleEnhancedResume(event: EnhanceDoneEvent)
    {
        val resume = resumeCacheService.getResumeById(event.id)

        resume.title = event.newTitle
        resume.profileDescription = event.newDescription
        resume.achievements.zip(event.newAchievementDescriptions)
            .forEach{ (achievement, description) -> achievement.description = description
            }

        resume.skills.zip(event.newSkillsNames)
            .forEach{ (skill, name) -> skill.name = name
        }

        resume.lastModified = Instant.now()

        resumeCacheService.saveResume(resume)

        applicationEventPublisher.publishEvent(
            StatusChangedEvent(
                event.trackerId,
                TrackerStatus.DONE
            )
        )

        applicationEventPublisher.publishEvent(
            ResumeReadyToExport(resume.id!!)
        )
    }

    fun requestEnhancement(id: UUID,
                           userId: UUID,
                           title: String,
                           profileDescription: String,
                           listOfSkills: List<String>,
                           listOfAchievements: List<String>
    )
    {
        val tracker = trackerService.createNewTracker(
            userId,
            TrackerType.ENHANCEMENT,
            id,
        )

        enhancementStreamTemplate.convertAndSend(
            EnhanceRequestedEvent(
                id,
                tracker.id!!,
                title,
                profileDescription,
                listOfAchievements,
                listOfSkills
            )
        )
    }
}