package pl.dayfit.auroracore.service

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import org.springframework.web.socket.TextMessage
import pl.dayfit.auroracore.dto.StatusChangedDto
import pl.dayfit.auroracore.event.StatusChangedEvent

@Service
class NotificationService(
    private val sessionService: SessionService,
    private val objectMapper: ObjectMapper
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

        val session = sessionService.getSessionByUserId(event.userId)

        if (session == null) {
            logger.debug("No session found for user with id {}", event.userId)
            return
        }

        session.forEach { it.sendMessage(
            TextMessage(
                objectMapper
                    .writeValueAsString(message)
            )
        ) }

        logger.trace("Notification sent. Id: {}, Status: {}", trackerId, trackerStatus)
    }
}