package pl.dayfit.auroracore.service

import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.AutoGenerationDataDto
import pl.dayfit.auroracore.event.AutoGenerationStartedEvent
import pl.dayfit.auroracore.exception.ResourceNotReadyYetException
import pl.dayfit.auroracore.model.redis.AutoGenerationData
import pl.dayfit.auroracore.repository.redis.AutoGenerationRepository
import pl.dayfit.auroracore.type.AutoGenerationSource
import pl.dayfit.auroracore.type.LanguageType
import pl.dayfit.auroracore.type.TrackerType
import java.util.UUID

@Service
class AutoGenerationService(
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val trackerService: TrackerService,
    private val autoGenerationRepository: AutoGenerationRepository
) {
    /**
     * Puts a request in processing queue
     */
    fun requestAutoGeneration(title: String, name: String, source: AutoGenerationSource, language: LanguageType, ownerId: UUID): String {
        val data = AutoGenerationData(
            null,
            title,
            ownerId = ownerId,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            language = language
        )

        val id = trackerService
            .createNewTracker(
                ownerId,
                TrackerType.AUTOGENERATION,
                autoGenerationRepository.save(data).id!!
            ).id!!

        applicationEventPublisher
            .publishEvent(
                AutoGenerationStartedEvent(
                    id,
                    ownerId,
                    name,
                    title,
                    source,
                    language
                )
            )

        return id
    }

    fun getAutoGenerationResult(trackingId: String, ownerId: UUID): AutoGenerationDataDto {
        val dataId = trackerService
            .getTrackedResourceId(
                trackingId,
                ownerId,
                TrackerType.AUTOGENERATION
            ) as String

        val data = autoGenerationRepository
            .findById(dataId)
            .orElseThrow { ResourceNotReadyYetException("Resource is not ready yet. Please try again later.") }

        return AutoGenerationDataDto(
            data.age,
            data.title,
            data.email,
            data.website,
            data.linkedIn,
            data.gitHub,
            data.profileImage,
            data.profileDescription,
            data.education.map {
                    AutoGenerationDataDto.Education(
                        it.institution,
                        it.major,
                        it.degree,
                        it.fromYear,
                        it.toYear
                    )
                },
            data.skills.map {
                AutoGenerationDataDto.Skill(
                    it.name,
                    it.level
                )
            },
            data.workExperiences.map {
                AutoGenerationDataDto.WorkExperience(
                    it.company,
                    it.position,
                    it.description,
                    it.startDate,
                    it.endDate
                )
            },
            data.personalPortfolios.map {
                AutoGenerationDataDto.PersonalPortfolio(
                    it.name,
                    it.description
                ) },
            data.achievements.map {
                AutoGenerationDataDto.Achievement(
                    it.title,
                    it.description,
                    it.year
                )
            },
            data.language
        )
    }
}