package pl.dayfit.auroracore.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.dto.GenerationResponseDto
import pl.dayfit.auroracore.service.GenerationService
import java.security.Principal
import java.util.UUID

@RestController
class GenerationController(val generationService: GenerationService) {

    @PostMapping("/generate")
    fun generate(requestDto: GenerationRequestDto, @AuthenticationPrincipal principal: Principal): ResponseEntity<GenerationResponseDto> {
        return ResponseEntity.ok(
            generationService.generateResume(
                requestDto,
                UUID.fromString(principal.name)
            )
        )
    }
}