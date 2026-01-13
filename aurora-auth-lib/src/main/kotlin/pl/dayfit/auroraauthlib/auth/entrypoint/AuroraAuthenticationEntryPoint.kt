package pl.dayfit.auroraauthlib.auth.entrypoint

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component

@Component
class AuroraAuthenticationEntryPoint (
    private val objectMapper: ObjectMapper
) : AuthenticationEntryPoint {
    override fun commence(
        request: HttpServletRequest?,
        response: HttpServletResponse?,
        authException: AuthenticationException?
    ) {
        response?.status = HttpServletResponse.SC_UNAUTHORIZED
        response?.contentType = "application/json"
        val body = mapOf(
            "error" to (authException?.message?: "Invalid credentials"
            ))

        response
            ?.outputStream
            ?.write(objectMapper.writeValueAsBytes(body))
    }
}