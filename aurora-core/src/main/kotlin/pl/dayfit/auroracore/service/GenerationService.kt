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
import org.apache.pdfbox.Loader
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.rendering.ImageType
import org.apache.pdfbox.rendering.PDFRenderer
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener
import org.springframework.web.multipart.MultipartFile
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.helper.ImageCompressorHelper
import pl.dayfit.auroracore.model.Achievement
import pl.dayfit.auroracore.model.Education
import pl.dayfit.auroracore.model.PersonalPortfolio
import pl.dayfit.auroracore.model.WorkExperience
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.model.Skill
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import pl.dayfit.auroracore.type.LanguageType
import pl.dayfit.auroracore.util.LocaleMapper
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.StringWriter
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class GenerationService(
    private val resumeCacheService: ResumeCacheService,
    private val freeMarkerConfiguration: Configuration,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val resumeService: ResumeService,
    private val enumLocalizationService: EnumLocalizationService,
    private val imageHelper: ImageCompressorHelper,
    private val messageSource: org.springframework.context.MessageSource
) {
    private val dpi = 300f
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
    fun requestGeneration(requestDto: GenerationRequestDto, file: MultipartFile, userId: UUID): UUID
    {
        val resume = Resume(
            null,
            userId,
            requestDto.language,
            null,
            requestDto.name,
            requestDto.surname,
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
            imageHelper.compressProfileImage(file.inputStream),

            null,
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

        applicationEventPublisher.publishEvent(
            ResumeReadyToExport(id)
        )
        logger.trace("Resume ready to export: {}", id)
        return id
    }

    /**
     * Generates a formatted resume document based on the specified event data.
     *
     * @param event The event containing the ID of the CV to be exported.
     * @return The generated résumé as a string.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun generateResume(event: ResumeReadyToExport)
    {
        val resume = resumeCacheService
            .getResumeById(event.id)

        val template: Template = freeMarkerConfiguration.getTemplate("resume${resume.templateVersion}.ftl")
        val data: MutableMap<String, Any?> = HashMap()

        // Personal data
        data["name"] = resume.name
        data["title"] = resume.title!!
        data["surname"] = resume.surname

        // Profile
        resume.profileImage?.let { data["profileImage"] = "data:image/png;base64, ${Base64.encode(it)}" }
        resume.profileDescription?.let { data["profileDescription"] = it }

        // Contact information
        data["email"] = resume.email
        resume.website?.let { data["website"] = it }
        resume.gitHub?.let { data["gitHub"] = it }
        resume.linkedIn?.let { data["linkedIn"] = it }

        // Localized template strings
        val locale = LocaleMapper.toLocale(resume.language)
        val messageArgs: Array<Any> = arrayOf()
        data["i18n_contact"] = messageSource.getMessage("template.contact", messageArgs, "Contact", locale)
        data["i18n_education"] = messageSource.getMessage("template.education", messageArgs, "Education", locale)
        data["i18n_skills"] = messageSource.getMessage("template.skills", messageArgs, "Skills", locale)
        data["i18n_workExperience"] = messageSource.getMessage("template.workExperience", messageArgs, "Work Experience", locale)
        data["i18n_profile"] = messageSource.getMessage("template.profile", messageArgs, "Profile", locale)
        data["i18n_about"] = messageSource.getMessage("template.about", messageArgs, "About", locale)
        data["i18n_projects"] = messageSource.getMessage("template.projects", messageArgs, "Projects", locale)
        data["i18n_achievements"] = messageSource.getMessage("template.achievements", messageArgs, "Achievements", locale)
        data["i18n_present"] = messageSource.getMessage("template.present", messageArgs, "Present", locale)
        data["i18n_professionalSummary"] = messageSource.getMessage("template.professionalSummary", messageArgs, "Professional Summary", locale)
        data["i18n_experience"] = messageSource.getMessage("template.experience", messageArgs, "Experience", locale)
        data["i18n_featuredProjects"] = messageSource.getMessage("template.featuredProjects", messageArgs, "Featured Projects", locale)
        data["i18n_achievementsAndAwards"] = messageSource.getMessage("template.achievementsAndAwards", messageArgs, "Achievements & Awards", locale)
        data["i18n_aboutMe"] = messageSource.getMessage("template.aboutMe", messageArgs, "About Me", locale)
        data["i18n_skillsAndCompetencies"] = messageSource.getMessage("template.skillsAndCompetencies", messageArgs, "Skills & Competencies", locale)
        data["i18n_projectsAndPortfolio"] = messageSource.getMessage("template.projectsAndPortfolio", messageArgs, "Projects & Portfolio", locale)
        data["i18n_professionalExperience"] = messageSource.getMessage("template.professionalExperience", messageArgs, "Professional Experience", locale)
        data["i18n_honorsAndAchievements"] = messageSource.getMessage("template.honorsAndAchievements", messageArgs, "Honors & Achievements", locale)
        data["i18n_linkedin"] = messageSource.getMessage("template.linkedin", messageArgs, "LinkedIn", locale)
        data["i18n_github"] = messageSource.getMessage("template.github", messageArgs, "GitHub", locale)
        data["i18n_website"] = messageSource.getMessage("template.website", messageArgs, "Website", locale)
        data["i18n_portfolio"] = messageSource.getMessage("template.portfolio", messageArgs, "Portfolio", locale)

        // Other information
        resume.education.let { educationList ->
            data["education"] = educationList.map { edu ->
                mapOf(
                    "id" to edu.id,
                    "institution" to edu.institution,
                    "major" to edu.major,
                    "degree" to enumLocalizationService.getLocalizedEducationDegree(edu.degree, resume.language),
                    "fromYear" to edu.fromYear,
                    "toYear" to edu.toYear
                )
            }
        }
        resume.skills.let { skillsList ->
            data["skills"] = skillsList.map { skill ->
                mapOf(
                    "id" to skill.id,
                    "name" to skill.name,
                    "level" to enumLocalizationService.getLocalizedSkillLevel(skill.level, resume.language)
                )
            }
        }
        resume.achievements.let { data["achievements"] = it}
        resume.workExperience.let { experienceList ->
            data["experiences"] = experienceList.map { exp ->
                mapOf(
                    "id" to exp.id,
                    "company" to exp.company,
                    "position" to exp.position,
                    "startDate" to formatDate(exp.startDate, resume.language),
                    "endDate" to formatDate(exp.endDate, resume.language),
                    "description" to exp.description
                )
            }
        }
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

                resume.previewImage = generatePreview(outPdf)
                resumeCacheService.saveResume(resume)

                resumeService
                    .handleSaving(outPdf, resume.auroraUserId, resume.id!!)
            }
        }
    }

    /**
     * Format an Instant date according to the target language locale
     */
    private fun formatDate(instant: Instant?, languageType: LanguageType?): String? {
        if (instant == null) return null
        
        val locale = LocaleMapper.toLocale(languageType)
        
        val formatter = DateTimeFormatter
            .ofLocalizedDate(FormatStyle.MEDIUM)
            .withLocale(locale)
            .withZone(ZoneId.systemDefault())
        
        return formatter.format(instant)
    }

    private fun generatePreview(pdfOutputStream: ByteArrayOutputStream): ByteArray {
        Loader.loadPDF(pdfOutputStream.toByteArray()).use { document: PDDocument ->
            val renderer = PDFRenderer(document)

            val image = renderer.renderImageWithDPI(0, dpi, ImageType.RGB)

            return imageHelper.compressPreview(image)
        }
    }
}