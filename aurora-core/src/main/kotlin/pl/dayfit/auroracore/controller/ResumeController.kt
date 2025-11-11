package pl.dayfit.auroracore.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroracore.dto.TranslationRequestDto
import pl.dayfit.auroracore.service.ResumeService
import java.util.UUID

@RestController
class ResumeController (
    private val resumeService: ResumeService
){
    @GetMapping("/get")
    fun getResume(@RequestParam id: String): ResponseEntity<Map<String, String>> {
            return ResponseEntity.ok(
                mapOf(
                        "result" to resumeService.getResume(
                            UUID.fromString(id)
                        )))
    }

    @PostMapping("/translate")
    fun translateResume(@RequestBody dto: TranslationRequestDto): ResponseEntity<Map<String, UUID>> {
        return ResponseEntity.ok(
            mapOf(
                "trackingId" to resumeService.translateResume(
                    dto.id, dto.language
                )
            )
        )
    }
}