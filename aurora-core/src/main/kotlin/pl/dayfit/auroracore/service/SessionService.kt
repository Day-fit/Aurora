package pl.dayfit.auroracore.service

import org.springframework.stereotype.Service
import org.springframework.web.socket.WebSocketSession
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class SessionService {
    private val sessions = ConcurrentHashMap<UUID, WebSocketSession>()

    fun addSession(session: WebSocketSession) {
        sessions[session.attributes["userId"] as UUID] = session
    }

    fun removeSession(session: WebSocketSession) {
        sessions.remove(session.attributes["userId"] as UUID)
    }

    fun getSessionByUserId(userId: UUID): WebSocketSession? {
        return sessions[userId]
    }
}