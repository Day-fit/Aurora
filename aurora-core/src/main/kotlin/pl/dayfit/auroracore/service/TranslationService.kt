package pl.dayfit.auroracore.service

import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.TranslationResumeDto
import pl.dayfit.auroracore.event.TranslationRequestedEvent
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import pl.dayfit.auroracore.type.LanguageType
import java.time.Instant
import java.util.UUID

@Service
class TranslationService (
    private val resumeCacheService: ResumeCacheService,
    private val translateStreamTemplate: RabbitStreamTemplate
){
    fun translateResume(id: UUID, language: LanguageType): UUID
    {
        val originalResume = resumeCacheService
            .getResumeById(id)

        val translatedResume = Resume(
            id = null,
            auroraUserId = originalResume.auroraUserId,
            language = language,
            name = originalResume.name,
            surname = originalResume.surname,
            age = originalResume.age,
            email = originalResume.email,
            templateVersion = originalResume.templateVersion,
            lastUpdate = Instant.now(),
            title = null,
            workExperiences = originalResume.workExperiences.map { it.copy(id = null) }.toMutableList(),
            skills = originalResume.skills.map { it.copy(id = null) }.toMutableList(),
            education = originalResume.education.map { it.copy(id = null) }.toMutableList(),
            achievements = originalResume.achievements.map { it.copy(id = null) }.toMutableList(),
            photo = originalResume.photo,
            description = null,
            website = originalResume.website,
            linkedIn = originalResume.linkedIn,
            gitHub = originalResume.gitHub,
        )

        val saved = resumeCacheService
            .saveResume(translatedResume)

        translateStreamTemplate.convertAndSend(
            TranslationRequestedEvent(
                language,
                TranslationResumeDto(
                    saved.id!!,
                    originalResume.title ?: "",
                    originalResume.description ?: "",
                    originalResume.achievements.map { it.title },
                    originalResume.achievements.map { it.description },
                    originalResume.skills.map { it.name },
                    originalResume.education.map { it.major.orEmpty() },
                    originalResume.workExperiences.map { it.position },
                    originalResume.workExperiences.map { it.description.orEmpty() }
                )
            )
        )

        return saved.id!!
    }
}