package pl.dayfit.auroracore.websocket.interceptor

import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.http.server.ServletServerHttpRequest
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor
import pl.dayfit.auroraauthlib.auth.provider.MicroserviceAuthProvider
import pl.dayfit.auroraauthlib.auth.token.MicroserviceTokenCandidate
import java.security.Principal
import java.util.UUID

@Component
class TrackerHandshakeInterceptor(
    private val microserviceAuthProvider: MicroserviceAuthProvider,
) : HandshakeInterceptor {
    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>
    ): Boolean {
        val serverHttpRequest = request as? ServletServerHttpRequest ?: return false
        val servletRequest = serverHttpRequest.servletRequest
        val bearer = servletRequest.getHeader("Authorization")
        val cookies = servletRequest.cookies

        val accessToken = when {
            bearer?.startsWith("Bearer ") == true -> bearer.removePrefix("Bearer ").trim()
            cookies != null -> cookies
                .find { it.name == "accessToken" }
                ?.value
            else -> null
        } ?: throw BadCredentialsException("No access token found")

        val auth = microserviceAuthProvider
            .authenticate(
                MicroserviceTokenCandidate(accessToken)
            )

        val principal = auth.principal as Principal
        attributes["userId"] = UUID.fromString(
            principal.name
        )

        return true
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?
    ) {
        //Ignored
    }
}
