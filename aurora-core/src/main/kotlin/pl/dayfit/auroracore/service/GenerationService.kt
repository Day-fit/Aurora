package pl.dayfit.auroracore.service

import freemarker.template.Template
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.model.Achievement
import pl.dayfit.auroracore.model.Education
import pl.dayfit.auroracore.model.Experience
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.model.Skill
import pl.dayfit.auroracore.repository.ResumeRepository
import java.time.Instant
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class GenerationService(val resumeRepository: ResumeRepository, val freemarkerConfiguration: freemarker.template.Configuration) {

    @Transactional
    fun requestGeneration(requestDto: GenerationRequestDto, userId: UUID)
    {
        val resume = Resume(
            null,
            userId,
            requestDto.name,
            requestDto.surname,
            requestDto.age,
            requestDto.experiences?.map {
                Experience(
                        null,
                    it.company,
                    it.position,
                    it.startDate,
                    it.endDate,
                    it.description
                )},
            requestDto.skills?.map {
                Skill(
                    null,
                    it.name,
                    it.level
                ) },
            requestDto.education?.map {
                Education(
                    null,
                    it.institution,
                    it.major,
                    it.degree,
                    it.fromYear,
                    it.toYear
                )
            },
            requestDto.achievements?.map {
                Achievement(
                    null,
                    it.title,
                    it.description,
                    it.year
                )
            },
            requestDto.profileImage?.let { Base64.decode(it) },
            requestDto.profileDescription,
            Instant.now()
        )

        resumeRepository.save(resume)

        val template: Template = freemarkerConfiguration.getTemplate("resume${requestDto.templateVersion}.ftl")
        val data: MutableMap<String, Any> = HashMap()

        //Personal data
        data["name"] = requestDto.name
        data["title"] = requestDto.title
        data["surname"] = requestDto.surname
        data["age"] = requestDto.age

        //Profile
        requestDto.profileImage?.let { data["profileImage"] = Base64.decode(it) } //TODO: Add base64 raw image support in template
        requestDto.profileDescription?.let { data["profileDescription"] = it }

        //Contact information
        requestDto.email?.let { data["email"] = it }
        requestDto.website?.let { data["website"] = it }
        requestDto.gitHub?.let { data["gitHub"] = it }
        requestDto.linkedIn?.let { data["linkedIn"] = it }

        //Other information
        requestDto.education?.let { data["education"] = it }
        requestDto.skills?.let { data["skills"] = it }
        requestDto.achievements?.let { data["achievements"] = it}
        requestDto.experiences?.let { data["experiences"] = it}

        if (!requestDto.enhanced)
        {
            //TODO: Add to generation queue
            return;
        }

        //TODO: Add enhanced generation with AI
    }
}