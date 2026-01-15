package pl.dayfit.auroracore.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import io.minio.BucketExistsArgs
import io.minio.GetObjectArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.StatObjectArgs
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.dayfit.auroracore.dto.EditResumeDto
import pl.dayfit.auroracore.dto.ResumeDetailsDto
import pl.dayfit.auroracore.dto.ResumeInformationDto
import pl.dayfit.auroracore.event.EnhanceRequestedEvent
import pl.dayfit.auroracore.event.ResumeReadyToExport
import pl.dayfit.auroracore.helper.AccessHelper
import pl.dayfit.auroracore.model.Achievement
import pl.dayfit.auroracore.model.Education
import pl.dayfit.auroracore.model.PersonalPortfolio
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.model.Skill
import pl.dayfit.auroracore.model.WorkExperience
import pl.dayfit.auroracore.service.cache.ResumeCacheService
import pl.dayfit.auroracore.type.TrackerType
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.time.Instant
import java.util.Base64
import java.util.UUID
import kotlin.jvm.javaClass

@Service
class ResumeService(
    private val resumeCacheService: ResumeCacheService,
    private val minioClient: MinioClient,
    private val jacksonObjectMapper: ObjectMapper,
    private val accessHelper: AccessHelper,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val enhancementStreamTemplate: RabbitStreamTemplate,
    private val trackerService: TrackerService,
) {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    private val prohibitedProperties = listOf("resumeId") //Might get bigger over time (that's why we're using a list)
    private val requiresMapping = listOf("personalPortfolio", "workExperience", "achievements", "skills")

    /**
     * Retrieves a list of all resumes associated with a specific user.
     *
     * @param userId The unique identifier of the user whose resumes are to be retrieved.
     * @return A list of ResumeInformationDto objects containing details about each résumé.
     */
    fun findAllResumes(userId: UUID): List<ResumeInformationDto>
    {
        return resumeCacheService
            .getAllResumesByOwnerId(userId)
            .map { resume ->
                ResumeInformationDto(
                resume.id!!,
                resume.title,
                resume.name,
                resume.surname,
                resume.profileImage?.let { Base64.getEncoder().encodeToString(it) },
                resume.language,
                getGenerationResultSize(userId, resume.id!!),
                resume.lastModified,
                resume.originalVersion?.id,
                resume.enhanced
            ) }
    }

    /**
     * Retrieves the resume information for the specified user and resume identifiers.
     *
     * @param userId The unique identifier of the user requesting the résumé.
     * @param resumeId The unique identifier of the résumé to be retrieved.
     * @return A `ResumeInformationDto` containing the details of the requested résumé.
     * @throws AccessDeniedException If the user does not have access to the requested résumé.
     */
    fun getResume(userId: UUID, resumeId: UUID): ResumeDetailsDto {
        val resume = resumeCacheService.getResumeById(resumeId)

        if(!accessHelper.isOwner(resume, userId)) {
            throw AccessDeniedException("You are not allowed to access this resume")
        }

        return ResumeDetailsDto(
            resume.language,
            resume.originalVersion?.id,
            resume.name,
            resume.surname,
            resume.age,
            resume.title,
            resume.workExperience
                .map { ResumeDetailsDto.WorkExperience(it.company, it.position, it.startDate, it.endDate, it.description) }
                .toMutableList(),
            resume.personalPortfolio
                .map { ResumeDetailsDto.PersonalPortfolio(it.name, it.description) }
                .toMutableList(),
            resume.skills
                .map { ResumeDetailsDto.Skill(it.name, it.level) }
                .toMutableList(),
            resume.education
                .map { ResumeDetailsDto.Education(it.institution, it.major, it.degree, it.fromYear, it.toYear) }
                .toMutableList(),
            resume.achievements
                .map { ResumeDetailsDto.Achievement(it.title, it.description, it.year) }
                .toMutableList(),
            resume.profileImage
                ?.let { Base64.getEncoder().encodeToString(it) },
            resume.profileDescription,
            resume.email,
            resume.website,
            resume.linkedIn,
            resume.gitHub,
            resume.templateVersion,
            resume.lastModified,
            resume.enhanced
        )
    }

    /**
     * Handles saving of a resume PDF file to MinIO for a specific owner and resume identifier.
     *
     * This method ensures that the target bucket corresponding to the owner's ID exists
     * in MinIO. If the bucket does not exist, it will be created. The résumé is saved
     * to the bucket as a PDF file using the given resume ID as the file name.
     *
     * @param outputStream The ByteArrayOutputStream containing the resume data in PDF format.
     * @param ownerId The UUID representing the owner of the résumé. This will be used as the bucket name.
     * @param resumeId The UUID representing the résumé. This will be used as the object (file) name within the bucket.
     * @throws Exception If any error occurs during the bucket existence check, bucket creation, or file upload process.
     */
    fun handleSaving(outputStream: ByteArrayOutputStream, ownerId: UUID, resumeId: UUID)
    {
        try {
            //Bucket should be created during registration; however, this is a fallback for cases when it is not
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(ownerId.toString()).build())) {
                minioClient.makeBucket(
                    MakeBucketArgs.builder()
                        .bucket(ownerId.toString())
                        .build()
                )
            }

            val bytes = outputStream.toByteArray()

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(ownerId.toString())
                    .`object`("$resumeId.pdf")
                    .stream(bytes.inputStream(), bytes.size.toLong(), -1)
                    .contentType("application/pdf")
                    .build()
            )
        } catch (e: Exception) {
            logger.error("Failed to save resume PDF to MinIO for ownerId=$ownerId, resumeId=$resumeId", e)
            throw e
        }
    }

    /**
     * Retrieves the generation result for the specified résumé associated with the given owner.
     *
     * @param ownerId The unique identifier of the owner.
     * @param resumeId The unique identifier of the résumé.
     * @return An InputStream representing the generated file for the specified résumé.
     */
    fun getGenerationResult(ownerId: UUID, resumeId: UUID): InputStream
    {
        if(!accessHelper.isOwner(resumeCacheService.getResumeById(resumeId), ownerId))
        {
            throw AccessDeniedException("You are not allowed to access this resume")
        }

        return minioClient.getObject(
            GetObjectArgs.builder()
                .bucket(ownerId.toString())
                .`object`("$resumeId.pdf")
                .build(),
        )
    }

    fun getGenerationResultSize(ownerId: UUID, resumeId: UUID): Long {
        if(!accessHelper.isOwner(resumeCacheService.getResumeById(resumeId), ownerId))
        {
            throw AccessDeniedException("You are not allowed to access this resume")
        }

        return minioClient.statObject(
            StatObjectArgs.builder()
                .bucket(ownerId.toString())
                .`object`("$resumeId.pdf")
                .build()
        ).size()
    }

    /**
     * Processes the editing of a résumé, validating access permissions, updating fields,
     * and handling further processing based on whether enhancement is requested.
     *
     * @param editDto The data transfer object containing the updated fields for the résumé.
     * @param userId The unique identifier of the user attempting to edit the résumé.
     * @throws AccessDeniedException If the user does not have ownership of the résumé being edited.
     */
    @Transactional
    fun processEdit(editDto: EditResumeDto, userId: UUID)
    {
        val resumeId = editDto.resumeId
        val resume = resumeCacheService.getResumeById(resumeId)

        if(!accessHelper.isOwner(resume, userId))
        {
            throw AccessDeniedException("You are not allowed to edit this resume")
        }

        val editNode = jacksonObjectMapper.valueToTree<ObjectNode>(editDto)
        val targetNode = jacksonObjectMapper.valueToTree<ObjectNode>(resume)

        editNode.properties()
            .filter { (_, value) -> !value.isNull && !prohibitedProperties.contains(value.textValue())}
            .forEach { (name, value) ->
                targetNode.set<JsonNode>(name, if (requiresMapping.contains(name)) handleMapping(name, value) else value)
            }

        val patchedResume = jacksonObjectMapper.treeToValue(targetNode, Resume::class.java)
        patchedResume.lastModified = Instant.now()
        resumeCacheService.saveResume(patchedResume)

        if (!editDto.enhanced)
        {
            applicationEventPublisher.publishEvent(
                ResumeReadyToExport(resumeId)
            )
            logger.trace("Resume ready to export: {}", resumeId)
            return
        }

        val tracker = trackerService.createNewTracker(
            userId,
            TrackerType.ENHANCEMENT,
            resumeId
        )

        enhancementStreamTemplate.convertAndSend(
            EnhanceRequestedEvent(
                resumeId,
                tracker.id!!,
                patchedResume.title ?: "(Title not specified)",
                patchedResume.profileDescription,
                patchedResume.achievements
                    .map { it.description }.toList(),
                patchedResume.skills
                    .map { it.name }.toList()
            )
        )

        logger.trace("Resume ready to export: {}", resume.id)
        return
    }

    /**
     * Processes and transforms a given JSON node based on the specified mapping name, converting
     * input data into a structured format suitable for serialization or further processing.
     *
     * @param name A string representing the name of the mapping, such as "education", "skills",
     *             "workExperience", "achievements", or "personalPortfolio".
     * @param value The JSON node containing data to be transformed into the corresponding object
     *              structures, depending on the mapping name.
     * @return A JSON node representing the transformed data. Returns null if the mapping is not recognized.
     * @throws IllegalArgumentException If the provided mapping name is unknown or unsupported.
     */
    fun handleMapping(name: String, value: JsonNode): JsonNode?
    {
        when(name) {
            "education" -> {
                val education = jacksonObjectMapper
                    .treeToValue(value, Array<EditResumeDto.Education>::class.java)
                    .map {
                        Education(
                            institution = it.institution,
                            major = it.major,
                            degree = it.degree,
                            fromYear = it.fromYear,
                            toYear = it.toYear
                        )
                    }
                    .toList()

                return jacksonObjectMapper.valueToTree(education)
            }
            "skills" -> {
                val skills = jacksonObjectMapper
                    .treeToValue(value, Array<EditResumeDto.Skill>::class.java)
                    .map {
                        Skill(
                            name = it.name,
                            level = it.level
                        )
                    }
                    .toList()

                return jacksonObjectMapper.valueToTree(skills)
            }
            "workExperience" -> {
                val experiences = jacksonObjectMapper
                    .treeToValue(value, Array<EditResumeDto.Experience>::class.java)
                    .map {
                        WorkExperience(
                            company = it.company,
                            position = it.position,
                            startDate = it.startDate,
                            endDate = it.endDate,
                            description = it.description
                        )
                    }
                    .toList()

                return jacksonObjectMapper.valueToTree(experiences)
            }
            "achievements" -> {
                val achievements = jacksonObjectMapper
                    .treeToValue(value, Array<EditResumeDto.Achievement>::class.java)
                    .map {
                        Achievement(
                            title = it.title,
                            description = it.description,
                            year = it.year
                        )
                    }
                    .toList()

                return jacksonObjectMapper.valueToTree(achievements)
            }
            "personalPortfolio" -> {
                val personalPortfolio = jacksonObjectMapper
                    .treeToValue(value, Array<EditResumeDto.PersonalPortfolio>::class.java)
                    .map {
                        PersonalPortfolio(
                            name = it.name,
                            description = it.description
                        )
                    }
                    .toList()

                return jacksonObjectMapper.valueToTree(personalPortfolio)
            }
            else -> throw IllegalArgumentException("Unknown property: $name")
        }
    }
}