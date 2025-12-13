package pl.dayfit.auroracore.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroracore.dto.AutoGenerationDto
import pl.dayfit.auroracore.dto.AutoGenerationRequestDto
import pl.dayfit.auroracore.service.AutoGenerationService
import java.security.Principal
import java.util.UUID

@RestController
@RequestMapping("/autogeneration")
class AutoGenerationController(
    private val autoGenerationService: AutoGenerationService
) {
    /**
     * Puts a request in processing queue
     * @return tracking id
     */
    @PostMapping("/")
    fun autoGenerate(@RequestBody dto: AutoGenerationRequestDto, @AuthenticationPrincipal principal: Principal): ResponseEntity<Map<String, String>> {
        val trackingId = autoGenerationService.requestAutoGeneration(
            dto.title,
            dto.name,
            dto.source,
            UUID.fromString(principal.name)
        )

        return ResponseEntity.ok(
            mapOf("trackingId" to trackingId)
        )
    }

    /**
     * Retrieves the auto-generation result for a specific tracking ID.
     *
     * @param trackingId the unique identifier used to track the auto-generation process
     * @return a ResponseEntity containing the auto-generation result wrapped as an AutoGenerationDto
     * @throws NoSuchElementException if no tracker exists for the given trackingId
     * @throws pl.dayfit.auroracore.exception.ResourceNotReadyYetException if the tracker result is not yet available
     */
    @GetMapping("/{trackingId}")
    fun getAutoGenerationResults(@PathVariable trackingId: String): ResponseEntity<AutoGenerationDto> {
        return ResponseEntity.ok(
            autoGenerationService.getAutoGenerationResult(trackingId)
        )
    }
}