package pl.dayfit.auroracore.websocket.handler

import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.WebSocketMessage
import org.springframework.web.socket.WebSocketSession
import pl.dayfit.auroracore.service.SessionService

@Component
class TrackerStatusHandler(
    private val sessionService: SessionService
) : WebSocketHandler {
    private val logger = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessionService.addSession(session)
    }

    override fun handleMessage(
        session: WebSocketSession,
        message: WebSocketMessage<*>
    )
    {
        //ignored
    }

    override fun handleTransportError(
        session: WebSocketSession,
        exception: Throwable
    ) {
        logger.error("Error occurred in WebSocket transport", exception)
    }

    override fun afterConnectionClosed(
        session: WebSocketSession,
        closeStatus: CloseStatus
    ) {
        sessionService.removeSession(session)
    }

    override fun supportsPartialMessages(): Boolean {
        return false
    }
}