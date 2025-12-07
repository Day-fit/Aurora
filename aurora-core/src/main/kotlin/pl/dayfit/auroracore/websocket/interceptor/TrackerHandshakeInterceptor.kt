package pl.dayfit.auroracore.websocket.interceptor

import org.springframework.http.HttpHeaders
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor
import java.lang.Exception

class TrackerHandshakeInterceptor : HandshakeInterceptor {
    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: Map<String?, Any?>
    ): Boolean {
        val accessToken = request.headers.getFirst(HttpHeaders.AUTHORIZATION)?.let {
            return@let it.substringAfter("Bearer ")
        } ?: return false

        //TODO complete the code by verifying the token, and adding user id to attributes

        return true
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?
    ) {
        TODO("Not yet implemented")
    }
}