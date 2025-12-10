package pl.dayfit.auroracore.service

import org.springframework.stereotype.Service
import org.springframework.web.socket.WebSocketSession
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class SessionService {
    private val sessions = ConcurrentHashMap<UUID, MutableList<WebSocketSession>>()

    fun addSession(session: WebSocketSession) {
        sessions[
            session.attributes["userId"] as? UUID
                ?: throw IllegalStateException("User not found in session attributes")
        ]?.add(session)
    }

    fun removeSession(session: WebSocketSession) {
        sessions.remove(
            session.attributes["userId"] as? UUID
                ?: throw IllegalStateException("User not found in session attributes")
        )?.remove(session)
    }

    fun getSessionByUserId(userId: UUID): MutableList<WebSocketSession>? {
        return sessions[userId]
    }
}