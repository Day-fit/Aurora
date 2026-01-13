package pl.dayfit.auroracore.service

import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.TranslationResumeDto
import pl.dayfit.auroracore.event.TranslationRequestedEvent
import pl.dayfit.auroracore.helper.AccessHelper
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import pl.dayfit.auroracore.type.LanguageType
import java.time.Instant
import java.util.UUID

@Service
class TranslationService (
    private val resumeCacheService: ResumeCacheService,
    private val translateStreamTemplate: RabbitStreamTemplate,
    private val accessHelper: AccessHelper
){
    /**
     * Translates a résumé into the specified language by creating a new translated version.
     * The translated résumé is saved in the cache, and a translation request event is dispatched.
     *
     * @param id The unique identifier of the original resumes to be translated.
     * @param language The target language for the translation, represented as a LanguageType.
     * @return The unique identifier of the newly created translated résumé.
     */
    fun translateResume(id: UUID, ownerId: UUID, language: LanguageType): UUID
    {
        val originalResume = resumeCacheService
            .getResumeById(id)

        if(!accessHelper.isOwner(originalResume, ownerId))
        {
            throw AccessDeniedException("You are not allowed to translate this resume")
        }

        val translatedResume = Resume(
            id = null,
            auroraUserId = originalResume.auroraUserId,
            language = language,
            name = originalResume.name,
            surname = originalResume.surname,
            age = originalResume.age,
            email = originalResume.email,
            templateVersion = originalResume.templateVersion,
            lastModified = Instant.now(),
            title = null,
            workExperience = originalResume.workExperience.map { it.copy(id = null) }.toMutableList(),
            skills = originalResume.skills.map { it.copy(id = null) }.toMutableList(),
            education = originalResume.education.map { it.copy(id = null) }.toMutableList(),
            achievements = originalResume.achievements.map { it.copy(id = null) }.toMutableList(),
            profileImage = originalResume.profileImage,
            profileDescription = null,
            originalVersion = originalResume.originalVersion ?: originalResume,
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
                    originalResume.profileDescription ?: "",
                    originalResume.achievements.map { it.title },
                    originalResume.achievements.map { it.description },
                    originalResume.skills.map { it.name },
                    originalResume.education.map { it.major.orEmpty() },
                    originalResume.workExperience.map { it.position },
                    originalResume.workExperience.map { it.description.orEmpty() }
                )
            )
        )

        return saved.id!!
    }
}