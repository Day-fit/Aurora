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
import pl.dayfit.auroracore.service.TranslationService
import java.io.OutputStream
import java.security.Principal
import java.util.UUID

@RestController
@RequestMapping("/resume")
class ResumeController (
    private val translationService: TranslationService,
    private val generationService: GenerationService
){
    @GetMapping("/get")
    fun getResume(@AuthenticationPrincipal principal: Principal, @RequestParam id: String, ): ResponseEntity<StreamingResponseBody> {
        val body = StreamingResponseBody { os: OutputStream ->
            val input = generationService.getGenerationResult(
                UUID.fromString(principal.name),
                UUID.fromString(id)
            )
            input.transferTo(os)
            input.close()
        }

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
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