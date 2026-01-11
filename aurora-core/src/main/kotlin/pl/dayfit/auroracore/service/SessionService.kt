package pl.dayfit.auroracore.service

import org.springframework.stereotype.Service
import org.springframework.web.socket.WebSocketSession
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class SessionService {
    //TODO: Make session management to use redis as storage
    private val sessions = ConcurrentHashMap<UUID, MutableList<WebSocketSession>>()

    /**
     * Adds the given WebSocket session to the storage, associating it with the user ID found
     * in the session's attributes. Throws an exception if the user ID is not present.
     *
     * @param session the WebSocket session to be added. The session must contain a "userId"
     * attribute of type UUID to properly associate it with the corresponding user.
     */
    fun addSession(session: WebSocketSession) {
        val userId = session.attributes["userId"] as? UUID ?: throw IllegalStateException("User not found in session attributes")
        sessions.computeIfAbsent(userId) { mutableListOf() }
            .add(session)
    }

    /**
     * Removes the given WebSocket session from the storage. The session is identified by the
     * user ID found in its attributes. If the user ID is not present, an exception is thrown.
     *
     * @param session the WebSocket session to be removed. The session must contain a "userId"
     * attribute of type UUID to properly locate and remove it from the storage.
     */
    fun removeSession(session: WebSocketSession) {
        val userId = session.attributes["userId"] as? UUID ?: throw IllegalStateException("User not found in session attributes")
        sessions[userId]?.remove(session)
    }

    /**
     * Retrieves all WebSocket sessions associated with the specified user ID.
     *
     * @param userId the unique identifier of the user whose WebSocket sessions are to be retrieved.
     * @return a mutable list of WebSocket sessions associated with the given user ID,
     * or null if no sessions are found for the specified user.
     */
    fun getSessionByUserId(userId: UUID): MutableList<WebSocketSession>? {
        return sessions[userId]
    }
}