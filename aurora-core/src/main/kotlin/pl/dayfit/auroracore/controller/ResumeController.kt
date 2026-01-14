package pl.dayfit.auroracore.controller

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import pl.dayfit.auroracore.dto.EditResumeDto
import pl.dayfit.auroracore.dto.EnhanceResumeDto
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.dto.ResumeInformationDto
import pl.dayfit.auroracore.dto.TranslationRequestDto
import pl.dayfit.auroracore.service.EnhancementService
import pl.dayfit.auroracore.service.GenerationService
import pl.dayfit.auroracore.service.ResumeService
import pl.dayfit.auroracore.service.TranslationService
import java.io.OutputStream
import java.security.Principal
import java.util.UUID

@RestController
@RequestMapping("/resume")
class ResumeController (
    private val translationService: TranslationService,
    private val generationService: GenerationService,
    private val resumeService: ResumeService,
    private val enhancementService: EnhancementService
){
    /**
     * Retrieves all resume IDs associated with the currently authenticated user.
     *
     * @param principal the security principal representing the currently authenticated user
     * @return a ResponseEntity containing a list of UUIDs, where each UUID represents a résumé associated with the authenticated user
     */
    @GetMapping("/getAll")
    fun getAllResumes(@AuthenticationPrincipal principal: Principal): ResponseEntity<List<ResumeInformationDto>> {
        return ResponseEntity
            .ok(
                resumeService
                    .findAllResumes(UUID.fromString(principal.name))
            )
    }

    /**
     * Retrieves a generated PDF résumé for the authenticated user based on the given resume ID.
     *
     * @param principal the security principal representing the currently authenticated user
     * @param id the ID of the résumé to retrieve, provided as a string
     * @return a ResponseEntity containing a StreamingResponseBody with the PDF content of the requested résumé
     */
    @GetMapping("/get")
    fun getResume(@AuthenticationPrincipal principal: Principal, @RequestParam id: String): ResponseEntity<StreamingResponseBody> {
        val userId = UUID.fromString(principal.name)
        val resumeId = UUID.fromString(id)

        val contentLength = resumeService.getGenerationResultSize(userId, resumeId)

        val body = StreamingResponseBody { os: OutputStream ->
            resumeService.getGenerationResult(
                userId,
                resumeId
            ).use { input ->
                input.transferTo(os)
                os.flush()
            }
        }

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(contentLength)
            .body(body)
    }

    /**
     * Translates a résumé into the specified language.
     *
     * @param dto a DTO containing the unique identifier of the résumé to be translated
     *            and the target language for the translation
     * @return a ResponseEntity containing a map with a single entry where the key is "trackingId"
     *         and the value is a UUID that serves as a tracking identifier for the translation process
     */
    @PostMapping("/translate")
    fun translateResume(@RequestBody dto: TranslationRequestDto, @AuthenticationPrincipal principal: Principal): ResponseEntity<Map<String, UUID>> {
        return ResponseEntity.ok(
            mapOf(
                "trackingId" to translationService.translateResume(
                    dto.id,
                    UUID.fromString(principal.name),
                    dto.language
                )
            )
        )
    }

    /**
     * Initiates the process of generating a new résumé based on the provided request data
     * and associates it with the currently authenticated user.
     *
     * @param requestDto the data transfer object containing the details required for resume generation
     * @param principal the security principal representing the currently authenticated user, or null if no user is authenticated
     * @return a ResponseEntity containing a map with a single entry where the key is "resumeId" and the value is a string representation of the newly generated résumé's unique identifier
     *
     */
    @PostMapping("/generate")
    fun generate(@RequestBody requestDto: GenerationRequestDto, @AuthenticationPrincipal principal: Principal): ResponseEntity<Map<String, String>> {
        val resumeId = generationService.requestGeneration(
            requestDto,
            UUID.fromString(
                principal.name
            )
        )

        return ResponseEntity.ok(
            mapOf("resumeId" to resumeId.toString())
        )
    }

    @PostMapping("/enhance")
    fun enhance(@RequestBody enhanceResumeDto: EnhanceResumeDto, @AuthenticationPrincipal principal: Principal): ResponseEntity<Map<String, String>> {
        val trackingId = enhancementService.requestEnhancement(
            enhanceResumeDto.id,
            UUID.fromString(principal.name)
        )

        return ResponseEntity.ok(mapOf("trackingId" to trackingId))
    }

    /**
     * Edits the details of an existing résumé associated with the authenticated user.
     *
     * @param editDto a data transfer object containing the updated information for the résumé
     * @param principal the security principal representing the currently authenticated user,
     *                  or null if no user is authenticated
     * @return a ResponseEntity containing a map with a single entry where the key is "message"
     *         and the value is a confirmation that the résumé was successfully edited
     */
    @PatchMapping("/edit")
    fun edit(@RequestBody editDto: EditResumeDto, @AuthenticationPrincipal principal: Principal?): ResponseEntity<Map<String, String>>
    {
        resumeService.processEdit(
            editDto,
            UUID.fromString(
                principal?.name
            )
        )

        return ResponseEntity.ok(
            mapOf("message" to "Resume edited successfully!")
        )
    }
}