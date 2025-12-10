package pl.dayfit.auroracore.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry
import pl.dayfit.auroracore.websocket.handler.TrackerStatusHandler
import pl.dayfit.auroracore.websocket.interceptor.TrackerHandshakeInterceptor

@Configuration
@EnableWebSocket
class WebSocketConfiguration(
    private val trackerStatusHandler: TrackerStatusHandler,
    private val trackerHandshakeInterceptor: TrackerHandshakeInterceptor
) : WebSocketConfigurer {
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(trackerStatusHandler, "/ws/tracker")
            .addInterceptors(trackerHandshakeInterceptor)
    }
}