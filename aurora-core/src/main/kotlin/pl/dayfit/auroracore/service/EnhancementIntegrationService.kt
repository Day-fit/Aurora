package pl.dayfit.auroracore.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PreDestroy
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.EnhanceDoneEvent
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import java.nio.charset.StandardCharsets

@Service
class EnhancementIntegrationService(
    private val resumeCacheService: ResumeCacheService,
    private val applicationEventPublisher: ApplicationEventPublisher,
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

    @EventListener
    fun handleEnhancedResume(event: EnhanceDoneEvent)
    {
        val resume = resumeCacheService.getResumeById(event.id)

        resume.title = event.newTitle
        resume.description = event.newDescription
        resume.achievements.zip(event.newAchievementDescriptions)
            .forEach{ (achievement, description) -> achievement.description = description
            }

        resume.skills.zip(event.newSkillsNames)
            .forEach{ (skill, name) -> skill.name = name
        }

        resumeCacheService.saveResume(resume)
        applicationEventPublisher.publishEvent(
            ResumeReadyToExport(resume.id!!)
        )
    }
}