package pl.dayfit.auroracore.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.service.GenerationService
import java.security.Principal
import java.util.UUID

@RestController
class GenerationController(val generationService: GenerationService) {

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