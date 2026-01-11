package pl.dayfit.auroracore.controller

import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroracore.dto.TrackerResponseDto
import pl.dayfit.auroracore.service.TrackerService
import java.security.Principal
import java.util.UUID

@RestController("/tracking")
class TrackingController(
    private val trackerService: TrackerService
) {
    /**
     * Retrieves all tracked tasks associated with the authenticated user.
     *
     * @param principal The authenticated user's details, used to identify the owner of the tracked tasks.
     * @return A ResponseEntity containing a list of TrackerResponseDto objects representing the tracked tasks.
     */
    @GetMapping("/getAll")
    fun getAllTrackedTasks(@AuthenticationPrincipal principal: Principal): ResponseEntity<List<TrackerResponseDto>>
    {
        return ResponseEntity.ok(
            trackerService.getAllTrackers(
                UUID.fromString(principal.name)
            )
        )
    }
}