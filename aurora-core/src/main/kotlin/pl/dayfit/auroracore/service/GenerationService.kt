package pl.dayfit.auroracore.service

import com.itextpdf.html2pdf.ConverterProperties
import com.itextpdf.html2pdf.HtmlConverter
import com.itextpdf.kernel.geom.PageSize
import com.itextpdf.kernel.pdf.PdfDocument
import com.itextpdf.kernel.pdf.PdfWriter
import com.itextpdf.styledxmlparser.css.media.MediaDeviceDescription
import com.itextpdf.styledxmlparser.css.media.MediaType
import freemarker.template.Configuration
import freemarker.template.Template
import jakarta.transaction.Transactional
import net.coobird.thumbnailator.Thumbnails
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener
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
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
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
    private val resumeService: ResumeService
) {
    private val logger = LoggerFactory.getLogger(GenerationService::class.java)

    /**
     * Initiates the generation process for a résumé based on the provided data.
     * This method saves the resume data to a cache, optionally triggers an enhancement
     * process, and notifies when the résumé is ready for export.
     *
     * @param requestDto Data transfer object containing the resume details
     *                   such as personal information, work experience,
     *                   education, skills, and other related fields.
     * @param userId The unique identifier of the user requesting the resume generation.
     * @return The unique identifier of the generated résumé.
     */
    @Transactional
    fun requestGeneration(requestDto: GenerationRequestDto, userId: UUID): UUID
    {
        val resume = Resume(
            null,
            userId,
            null,
            null,
            requestDto.name,
            requestDto.surname,
            requestDto.age,
            requestDto.title,
            requestDto.workExperience.map {
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
            requestDto.profileImage?.let {
                val inputStream = ByteArrayInputStream(Base64.decode(it))
                val outputStream = ByteArrayOutputStream()
                Thumbnails.of(inputStream)
                    .outputQuality(0.75)
                    .size(600, 600)
                    .toOutputStream(outputStream)

                return@let outputStream.toByteArray()
            },

            requestDto.profileDescription,
            requestDto.email,
            requestDto.website,
            requestDto.linkedIn,
            requestDto.gitHub,
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
     * @return The generated résumé as a string.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
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
        resume.profileImage?.let { data["profileImage"] = "data:image/png;base64, ${Base64.encode(it)}" }
        resume.profileDescription?.let { data["profileDescription"] = it }

        //Contact information
        data["email"] = resume.email
        resume.website?.let { data["website"] = it }
        resume.gitHub?.let { data["gitHub"] = it }
        resume.linkedIn?.let { data["linkedIn"] = it }

        //Other information
        resume.education.let { data["education"] = it }
        resume.skills.let { data["skills"] = it }
        resume.achievements.let { data["achievements"] = it}
        resume.workExperience.let { data["experiences"] = it}
        resume.personalPortfolio.let { data["personalPortfolio"] = it }

        StringWriter().use {
            htmlOs -> template.process(data, htmlOs)

            ByteArrayOutputStream().use { outPdf ->
                val writer = PdfWriter(outPdf)
                val pdfDoc = PdfDocument(writer)
                pdfDoc.defaultPageSize = PageSize.A4

                val props = ConverterProperties()
                val media = MediaDeviceDescription(MediaType.PRINT)
                media.width = PageSize.A4.width
                media.height = PageSize.A4.height
                props.mediaDeviceDescription = media
                val htmlBytes = htmlOs.toString().toByteArray()

                HtmlConverter.convertToPdf(
                    ByteArrayInputStream(htmlBytes),
                    pdfDoc,
                    props
                )

                pdfDoc.close()

                resumeService
                    .handleSaving(outPdf, resume.auroraUserId, resume.id!!)
            }
        }

        resumeCacheService.saveResume(resume)
    }
}