package pl.dayfit.auroracore.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PreDestroy
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.event.TranslationDoneEvent
import pl.dayfit.auroracore.repository.ResumeRepository
import java.nio.charset.StandardCharsets

@Service
class TranslationIntegrationService(
    val resumeRepository: ResumeRepository,
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

    @EventListener
    private fun handleTranslatedResume(event: TranslationDoneEvent)
    {
        val resume = resumeRepository.findById(
            event.resume.id
        ).orElseThrow { IllegalStateException("Resume not found") }

        val translationResult = event.resume
        resume.title = translationResult.title
        resume.description = translationResult.description

        resume.experiences.zip(translationResult.experiencePositions)
            .forEach { (experience, position) -> experience.position = position}

        resume.experiences.zip(translationResult.experienceDescriptions)
            .forEach { (experience, description) -> experience.description = description }

        resume.achievements.zip(translationResult.achievementsTitles)
            .forEach { (achievement, title) -> achievement.title = title }

        resume.achievements.zip(translationResult.achievementsDescriptions)
            .forEach { (achievement, description) -> achievement.description = description }

        resume.education.zip(translationResult.educationMajors)
            .forEach { (education, major) -> education.major = major }

        resume.skills.zip(translationResult.skillsNames)
            .forEach { (skill, skillName) -> skill.name = skillName }

        resumeRepository.saveAndFlush(resume)

        applicationEventPublisher.publishEvent(
            ResumeReadyToExport(resume.id!!)
        )
    }
}
