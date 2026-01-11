package pl.dayfit.auroracore.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PreDestroy
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.event.StatusChangedEvent
import pl.dayfit.auroracore.event.TranslationDoneEvent
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import pl.dayfit.auroracore.type.TrackerStatus
import java.nio.charset.StandardCharsets

@Service
class TranslationIntegrationService(
    private val resumeCacheService: ResumeCacheService,
    private val applicationEventPublisher: ApplicationEventPublisher,
    streamsEnvironment: Environment,
) {
    private val consumer = streamsEnvironment.consumerBuilder()
        .stream("post.translation.stream")
        .offset(OffsetSpecification.next())
        .messageHandler { _, record ->
            val json = String(record.bodyAsBinary, StandardCharsets.UTF_8)

            applicationEventPublisher.publishEvent(
            jacksonObjectMapper()
                .readValue(
                    json,
                    TranslationDoneEvent::class.java
                )
            )
        }
        .build()

    @PreDestroy
    private fun destroy() {
        consumer.close()
    }

    /**
     * Handles an event indicating that a resume translation has been completed. Updates the resume data
     * in the cache with the translated values and publishes an event to signal that the résumé is ready
     * for export.
     *
     * @param event The event containing the translated resume data and associated metadata.
     */
    @EventListener
    private fun handleTranslatedResume(event: TranslationDoneEvent)
    {
        val resume = resumeCacheService.getResumeById(event.resume.id)

        val translationResult = event.resume
        resume.title = translationResult.title
        resume.profileDescription = translationResult.description

        resume.workExperience.zip(translationResult.experiencePositions)
            .forEach { (experience, position) -> experience.position = position}

        resume.workExperience.zip(translationResult.experienceDescriptions)
            .forEach { (experience, description) -> experience.description = description }

        resume.achievements.zip(translationResult.achievementsTitles)
            .forEach { (achievement, title) -> achievement.title = title }

        resume.achievements.zip(translationResult.achievementsDescriptions)
            .forEach { (achievement, description) -> achievement.description = description }

        resume.education.zip(translationResult.educationMajors)
            .forEach { (education, major) -> education.major = major }

        resume.skills.zip(translationResult.skillsNames)
            .forEach { (skill, skillName) -> skill.name = skillName }

        resumeCacheService.saveResume(resume)

        applicationEventPublisher.publishEvent(
            StatusChangedEvent(
                resume.auroraUserId,
                event.trackerId,
                TrackerStatus.DONE
            )
        )

        applicationEventPublisher.publishEvent(
            ResumeReadyToExport(resume.id!!)
        )
    }
}
