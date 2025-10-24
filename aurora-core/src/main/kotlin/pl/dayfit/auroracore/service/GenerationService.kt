package pl.dayfit.auroracore.service

import com.itextpdf.html2pdf.HtmlConverter
import com.rabbitmq.stream.Consumer
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import freemarker.template.Configuration
import freemarker.template.Template
import jakarta.annotation.PostConstruct
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.event.EnhanceDoneEvent
import pl.dayfit.auroracore.event.EnhanceRequestedEvent
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.model.Achievement
import pl.dayfit.auroracore.model.Education
import pl.dayfit.auroracore.model.Experience
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.model.Skill
import pl.dayfit.auroracore.repository.ResumeRepository
import tools.jackson.databind.ObjectMapper
import java.io.ByteArrayOutputStream
import java.io.StringWriter
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.util.NoSuchElementException
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class GenerationService(
    private val resumeRepository: ResumeRepository,
    private val freemarkerConfiguration: Configuration,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val streamTemplate: RabbitStreamTemplate,
    private val streamsEnvironment: Environment,
    private val objectMapper: ObjectMapper,
    private val enhanceIntegrationService: EnhanceIntegrationService
) {
    private val logger = LoggerFactory.getLogger(GenerationService::class.java)
    private lateinit var consumer: Consumer

    @PostConstruct
    fun init()
    {
        consumer = streamsEnvironment.consumerBuilder()
            .stream("generation_stream")
            .offset(OffsetSpecification.next())
            .messageHandler { _, record ->
                run {
                    val json = String(record.bodyAsBinary, StandardCharsets.UTF_8)
                    enhanceIntegrationService.saveEnhancedResume(
                        this.mapToEvent(json)
                    )
                }
            }
            .build()
    }

    @Transactional
    fun requestGeneration(requestDto: GenerationRequestDto, userId: UUID)
    {
        val resume = Resume(
            null,
            userId,
            requestDto.name,
            requestDto.surname,
            requestDto.age,
            requestDto.title,
            requestDto.experiences.map {
                Experience(
                        null,
                    it.company,
                    it.position,
                    it.startDate,
                    it.endDate,
                    it.description
                )},
            requestDto.skills.map {
                Skill(
                    null,
                    it.name,
                    it.level
                ) },
            requestDto.education.map {
                Education(
                    null,
                    it.institution,
                    it.major,
                    it.degree,
                    it.fromYear,
                    it.toYear
                )
            },
            requestDto.achievements.map {
                Achievement(
                    null,
                    it.title,
                    it.description,
                    it.year
                )
            },
            requestDto.profileImage?.let { Base64.decode(it) },

            requestDto.profileDescription,
            requestDto.email,
            requestDto.website,
            requestDto.gitHub,
            requestDto.linkedIn,
            null,
            requestDto.templateVersion,
            Instant.now(),
        )

        resumeRepository.save(resume)

        if (!requestDto.enhanced)
        {
            applicationEventPublisher.publishEvent(
                ResumeReadyToExport(resume.id!!)
            )
            logger.trace("Resume ready to export: {}", resume.id)
            return
        }

        streamTemplate.convertAndSend(
            EnhanceRequestedEvent(
                resume.id!!,
                requestDto.title,
                requestDto.profileDescription,
                requestDto.achievements
                    .map { it.description }.toList(),
                requestDto.skills
                    .map { it.name }.toList()
            )
        )

        logger.trace("Resume ready to export: {}", resume.id)
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
        val resume = resumeRepository.findById(event.id)
            .orElseThrow { NoSuchElementException("Resume not found") }

        val template: Template = freemarkerConfiguration.getTemplate("resume${resume.templateVersion}.ftl")
        val data: MutableMap<String, Any> = HashMap()

        //Personal data
        data["name"] = resume.name
        data["title"] = resume.title
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
        resume.education?.let { data["education"] = it }
        resume.skills?.let { data["skills"] = it }
        resume.achievements?.let { data["achievements"] = it}
        resume.experiences?.let { data["experiences"] = it}

        StringWriter().use {
            out -> template.process(data, out)

            ByteArrayOutputStream().use { outPdf ->
                HtmlConverter.convertToPdf(
                    out.toString(),
                    outPdf
                )

                resume.generatedResult = outPdf.toByteArray()
            }
        }
    }

    private fun mapToEvent(json: String): EnhanceDoneEvent
    {
        return objectMapper.readValue(
            json,
            EnhanceDoneEvent::class.java
        )
    }
}