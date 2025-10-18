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
        generationService.requestGeneration(
            requestDto,
            UUID.fromString("1186f8f9-131d-455b-9966-9d0f306090c2") //TODO: swap for actual logic, when auth service will be compleated
        )

        return ResponseEntity.ok(
            mapOf("message" to "Resume request placed successfully!")
        )
    }
}