package pl.dayfit.auroracore.controller

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.dto.TranslationRequestDto
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
    private val resumeService: ResumeService
){
    @GetMapping("/getAll")
    fun getAllResumes(@AuthenticationPrincipal principal: Principal): ResponseEntity<List<UUID>> {
        return ResponseEntity
            .ok(
                resumeService
                    .findAllResumes(UUID.fromString(principal.name))
            )
    }

    @GetMapping("/get")
    fun getResume(@AuthenticationPrincipal principal: Principal, @RequestParam id: String): ResponseEntity<StreamingResponseBody> {
        val userId = UUID.fromString(principal.name)
        val resumeId = UUID.fromString(id)

        val contentLength = generationService.getGenerationResultSize(userId, resumeId)

        val body = StreamingResponseBody { os: OutputStream ->
            generationService.getGenerationResult(
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

    @PostMapping("/translate")
    fun translateResume(@RequestBody dto: TranslationRequestDto): ResponseEntity<Map<String, UUID>> {
        return ResponseEntity.ok(
            mapOf(
                "trackingId" to translationService.translateResume(
                    dto.id, dto.language
                )
            )
        )
    }

    @PostMapping("/generate")
    fun generate(@RequestBody requestDto: GenerationRequestDto, @AuthenticationPrincipal principal: Principal?): ResponseEntity<Map<String, String>> {
        val trackingId = generationService.requestGeneration(
            requestDto,
            UUID.fromString(
                principal?.name
            )
        )

        return ResponseEntity.ok(
            mapOf("trackingId" to trackingId.toString())
        )
    }
}