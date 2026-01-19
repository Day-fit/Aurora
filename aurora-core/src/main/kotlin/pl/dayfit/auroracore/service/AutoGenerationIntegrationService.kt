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
import pl.dayfit.auroracore.model.redis.AutoGenerationData
import pl.dayfit.auroracore.repository.redis.AutoGenerationRepository
import pl.dayfit.auroracore.type.TrackerStatus
import pl.dayfit.auroracore.type.TrackerType

/**
 * Service responsible for integration with auto-generation (AI microservice).
 * Service handles incoming messages from the stream and saves responses to trackers.
 */
@Service
class AutoGenerationIntegrationService(
    streamsEnvironment: Environment,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val rabbitObjectMapper: ObjectMapper,
    private val autoGenerationRepository: AutoGenerationRepository,
    private val trackerService: TrackerService
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
        val id: String = trackerService.getTrackedResourceId(
            event.trackerId,
            TrackerType.AUTOGENERATION
        ) as String

        val generationData: AutoGenerationData = autoGenerationRepository.findById(id)
            .orElseThrow { IllegalStateException("Generation data not found") }

        val result = event.result

        generationData.email = result.email
        generationData.website = result.website
        generationData.linkedIn = result.linkedIn
        generationData.gitHub = result.gitHub
        generationData.profileImage = result.profileImage
        generationData.profileDescription = result.profileDescription

        generationData.skills = result.skills.map { skillDto ->
            AutoGenerationData.Skill(
                name = skillDto.name,
                level = skillDto.level
            )
        }
        generationData.education = result.education.map { educationDto ->
            AutoGenerationData.Education(
                institution = educationDto.institution,
                major = educationDto.major,
                degree = educationDto.degree,
                fromYear = educationDto.fromYear,
                toYear = educationDto.toYear
            )
        }
        generationData.workExperiences = result.workExperiences.map { workExperienceDto ->
            AutoGenerationData.WorkExperience(
                company = workExperienceDto.company,
                position = workExperienceDto.position,
                description = workExperienceDto.description,
                startDate = workExperienceDto.startDate,
                endDate = workExperienceDto.endDate
            )
        }
        generationData.personalPortfolios = result.personalPortfolios.map { portfolioDto ->
            AutoGenerationData.PersonalPortfolio(
                name = portfolioDto.name,
                description = portfolioDto.description
            )
        }
        generationData.achievements = result.achievements.map { achievementDto ->
            AutoGenerationData.Achievement(
                title = achievementDto.title,
                description = achievementDto.description,
                year = achievementDto.year
            )
        }

        autoGenerationRepository.save(generationData)

        applicationEventPublisher
            .publishEvent(
                StatusChangedEvent(
                    event.trackerId,
                    TrackerStatus.DONE
                )
            )
    }
}