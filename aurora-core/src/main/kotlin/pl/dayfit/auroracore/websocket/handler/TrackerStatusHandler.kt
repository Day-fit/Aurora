package pl.dayfit.auroracore.websocket.handler

import org.springframework.web.socket.BinaryMessage
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.io.IOException

class TrackerStatusHandler : TextWebSocketHandler() {
    override fun handleBinaryMessage(session: WebSocketSession, message: BinaryMessage) {
        session.
        session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Binary messages not supported"))
    }
}