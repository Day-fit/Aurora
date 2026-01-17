package pl.dayfit.auroraauth.oauth

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.common.net.HttpHeaders
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.configuration.properties.CookiesConfigurationProperties
import pl.dayfit.auroraauth.configuration.properties.JwtConfigurationProperties
import pl.dayfit.auroraauth.oauth.worker.OAuthInfoWorker
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.service.AuthService
import pl.dayfit.auroraauth.service.JwtGenerationService
import pl.dayfit.auroraauth.type.AuthProvider

@Component
class OAuthSuccessHandler(
    private val authService: AuthService,
    private val userRepository: UserRepository,
    private val infoWorkers: List<OAuthInfoWorker>,
    private val jwtGenerationService: JwtGenerationService,
    private val jacksonObjectMapper: ObjectMapper,
    private val cookiesConfigurationProperties: CookiesConfigurationProperties,
    private val jwtConfigurationProperties: JwtConfigurationProperties
) : AuthenticationSuccessHandler {

    @Value($$"${aurora.callback-url}")
    private lateinit var callbackUri: String

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {
        val token = authentication as OAuth2AuthenticationToken

        val worker = infoWorkers.find {
            runCatching {
                it.supports(AuthProvider
                    .valueOf(
                        token.authorizedClientRegistrationId.uppercase()
                    )
                )
            }.getOrElse { false }
        }

        if (worker == null) {
            response.status = HttpServletResponse.SC_NOT_IMPLEMENTED
            response.writer
                .write(
                    jacksonObjectMapper
                        .writeValueAsString(mapOf("error" to "Provider not supported"))
                )
            return
        }

        val info = worker.handle(token)

        val result = userRepository.findByUsernameOrEmail(
            info.username,
            info.email
        )

        val uuid = result.map { it.id!! }
            .orElseGet { authService.handleRegistration(info) }

        val pair = jwtGenerationService.generateTokenPair(
            uuid
        )

        val refreshTokenCookie = ResponseCookie.from("refreshToken", pair.second)
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(jwtConfigurationProperties
                .refreshTokenValidity
                .inWholeSeconds
            )
            .build()

        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
        response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer ${pair.first}")

        response.sendRedirect("$callbackUri?status=${response.status}")
    }
}
