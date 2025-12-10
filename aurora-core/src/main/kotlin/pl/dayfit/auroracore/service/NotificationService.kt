package pl.dayfit.auroracore.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import org.springframework.web.socket.TextMessage
import pl.dayfit.auroracore.dto.StatusChangedDto
import pl.dayfit.auroracore.event.StatusChangedEvent

@Service
class NotificationService(
    private val sessionService: SessionService
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    @EventListener
    fun handleNotifying(event: StatusChangedEvent) {
        val trackerId = event.trackerId
        val trackerStatus = event.status

        val message = StatusChangedDto(
            trackerId,
            trackerStatus
        )

        sessionService.getSessionByUserId(event.userId)?.sendMessage(
            TextMessage(
                jacksonObjectMapper()
                    .writeValueAsString(message)
            )
        )

        logger.trace("Notification sent. Id: {}, Status: {}", trackerId, trackerStatus)
    }
}