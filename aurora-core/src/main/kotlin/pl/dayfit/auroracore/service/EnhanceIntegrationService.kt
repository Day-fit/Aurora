package pl.dayfit.auroracore.service

import jakarta.transaction.Transactional
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.EnhanceDoneEvent
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.repository.ResumeRepository

@Service
class EnhanceIntegrationService(
    val resumeRepository: ResumeRepository,
    private val applicationEventPublisher: ApplicationEventPublisher
) {

    @Transactional
    fun saveEnhancedResume(event: EnhanceDoneEvent)
    {
        val resume = resumeRepository.findById(event.id)
            .orElseThrow{ IllegalStateException("Resume not found, but should be present") }

        resume.title = event.newTitle
        resume.description = event.newDescription
        resume.achievements?.zip(event.newAchievementDescriptions)?.forEach{
                (achievement, description) -> achievement.description = description
        }
        resume.skills?.zip(event.newSkillsNames)?.forEach{
                (skill, name) -> skill.name = name
        }

        resumeRepository.saveAndFlush(resume)
        applicationEventPublisher.publishEvent(
            ResumeReadyToExport(resume.id!!)
        )
    }
}