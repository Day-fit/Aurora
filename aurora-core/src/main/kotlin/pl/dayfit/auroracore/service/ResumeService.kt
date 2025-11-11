package pl.dayfit.auroracore.service

import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.TranslationResumeDto
import pl.dayfit.auroracore.event.TranslationRequestedEvent
import pl.dayfit.auroracore.exception.ResumeNotGeneratedYetException
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.repository.ResumeRepository
import pl.dayfit.auroracore.type.LanguageType
import java.time.Instant
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class ResumeService (
    private val resumeRepository: ResumeRepository,
    private val translateStreamTemplate: RabbitStreamTemplate
) {
    fun getResume(id: UUID): String {
        val resume = resumeRepository.findById(id)
            .orElseThrow{ NoSuchElementException("There is no resume with such a id") }

        val result = resume.generatedResult
            ?: throw ResumeNotGeneratedYetException("Resume has not been generated yet")

        return Base64.encode(result)
    }

    fun translateResume(id: UUID, language: LanguageType): UUID
    {
        val originalResume = resumeRepository.findById(id)
            .orElseThrow { NoSuchElementException("There is no resume with such a id") }

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
            experiences = originalResume.experiences.map { it.copy(id = null) }.toMutableList(),
            skills = originalResume.skills.map { it.copy(id = null) }.toMutableList(),
            education = originalResume.education.map { it.copy(id = null) }.toMutableList(),
            achievements = originalResume.achievements.map { it.copy(id = null) }.toMutableList(),
            photo = originalResume.photo,
            description = null,
            website = originalResume.website,
            linkedIn = originalResume.linkedIn,
            gitHub = originalResume.gitHub,
            generatedResult = null
        )

        val saved = resumeRepository.save(translatedResume)

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
                    originalResume.experiences.map { it.position },
                    originalResume.experiences.map { it.description.orEmpty() }
                )
            )
        )

        return saved.id!!
    }
}