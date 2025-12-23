package pl.dayfit.auroracore.service

import com.itextpdf.html2pdf.HtmlConverter
import freemarker.template.Configuration
import freemarker.template.Template
import io.minio.GetObjectArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.event.EnhanceRequestedEvent
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.model.Achievement
import pl.dayfit.auroracore.model.Education
import pl.dayfit.auroracore.model.PersonalPortfolio
import pl.dayfit.auroracore.model.WorkExperience
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.model.Skill
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.StringWriter
import java.time.Instant
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class GenerationService(
    private val resumeCacheService: ResumeCacheService,
    private val freeMarkerConfiguration: Configuration,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val enhancementStreamTemplate: RabbitStreamTemplate,
    private val minioClient: MinioClient
) {
    private val logger = LoggerFactory.getLogger(GenerationService::class.java)

    @Transactional
    fun requestGeneration(requestDto: GenerationRequestDto, userId: UUID): UUID
    {
        val resume = Resume(
            null,
            userId,
            null,
            requestDto.name,
            requestDto.surname,
            requestDto.age,
            requestDto.title,
            requestDto.experiences.map {
                WorkExperience(
                        null,
                    it.company,
                    it.position,
                    it.startDate,
                    it.endDate,
                    it.description
                )}.toMutableList(),
            requestDto.personalPortfolio.map {
                PersonalPortfolio(
                    null,
                    it.name,
                    it.description
                )
            }.toMutableList(),
            requestDto.skills.map {
                Skill(
                    null,
                    it.name,
                    it.level
                ) }.toMutableList(),
            requestDto.education.map {
                Education(
                    null,
                    it.institution,
                    it.major,
                    it.degree,
                    it.fromYear,
                    it.toYear
                )
            }.toMutableList(),
            requestDto.achievements.map {
                Achievement(
                    null,
                    it.title,
                    it.description,
                    it.year
                )
            }.toMutableList(),
            requestDto.profileImage?.let { Base64.decode(it) },

            requestDto.profileDescription,
            requestDto.email,
            requestDto.website,
            requestDto.gitHub,
            requestDto.linkedIn,
            requestDto.templateVersion,
            Instant.now(),
        )

        val id = resumeCacheService.saveResume(resume)
            .id!!

        if (!requestDto.enhanced)
        {
            applicationEventPublisher.publishEvent(
                ResumeReadyToExport(id)
            )
            logger.trace("Resume ready to export: {}", id)
            return id
        }

        enhancementStreamTemplate.convertAndSend(
            EnhanceRequestedEvent(
                id,
                requestDto.title,
                requestDto.profileDescription,
                requestDto.achievements
                    .map { it.description }.toList(),
                requestDto.skills
                    .map { it.name }.toList()
            )
        )

        logger.trace("Resume ready to export: {}", resume.id)
        return id
    }

    /**
     * Generates a formatted resume document based on the specified event data.
     *
     * @param event The event containing the ID of the CV to be exported.
     * @return The generated resume as a string.
     */
    @EventListener
    fun generateResume(event: ResumeReadyToExport)
    {
        val resume = resumeCacheService
            .getResumeById(event.id)

        val template: Template = freeMarkerConfiguration.getTemplate("resume${resume.templateVersion}.ftl")
        val data: MutableMap<String, Any> = HashMap()

        //Personal data
        data["name"] = resume.name
        data["title"] = resume.title!!
        data["surname"] = resume.surname
        data["age"] = resume.age

        //Profile
        resume.photo?.let { data["profileImage"] = "data:image/png;base64, ${Base64.encode(it)}" }
        resume.description?.let { data["profileDescription"] = it }

        //Contact information
        data["email"] = resume.email
        resume.website?.let { data["website"] = it }
        resume.gitHub?.let { data["gitHub"] = it }
        resume.linkedIn?.let { data["linkedIn"] = it }

        //Other information
        resume.education.let { data["education"] = it }
        resume.skills.let { data["skills"] = it }
        resume.achievements.let { data["achievements"] = it}
        resume.workExperiences.let { data["experiences"] = it}

        StringWriter().use {
            out -> template.process(data, out)

            ByteArrayOutputStream().use { outPdf ->
                HtmlConverter.convertToPdf(
                    out.toString(),
                    outPdf
                )

                handleSaving(outPdf, resume.auroraUserId, resume.id!!)
            }
        }

        resumeCacheService.saveResume(resume)
    }

    fun getGenerationResult(ownerId: UUID, resumeId: UUID): InputStream
    {
        return minioClient.getObject(
            GetObjectArgs.builder()
                .bucket(ownerId.toString())
                .`object`("$resumeId.pdf")
                .build(),
        ).buffered()
    }

    private fun handleSaving(outputStream: ByteArrayOutputStream, ownerId: UUID, resumeId: UUID)
    {
        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket(ownerId.toString())
                .stream(outputStream.toByteArray().inputStream(), outputStream.size().toLong(), 5 * 1024 * 1024L)
                .`object`("$resumeId.pdf")
                .contentType("application/pdf")
                .build()
        )
    }
}