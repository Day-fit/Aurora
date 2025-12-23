package pl.dayfit.auroraauth.oauth

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import pl.dayfit.auroraauth.model.AuroraUser
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.service.AuthService
import pl.dayfit.auroraauth.service.JwtGenerationService
import pl.dayfit.auroraauth.type.AuthProvider
import pl.dayfit.auroraauthlib.type.RoleType

@Component
class OAuthSuccessHandler(
    private val authService: AuthService,
    private val userRepository: UserRepository,
    private val infoWorkers: List<OAuthInfoWorker>,
    private val jwtGenerationService: JwtGenerationService,
    private val jacksonObjectMapper: ObjectMapper
) : AuthenticationSuccessHandler {

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
            response.status = HttpServletResponse.SC_BAD_REQUEST
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

        val uuid = (result.orElseGet {
            val user = AuroraUser(
                null,
                info.username,
                info.email,
                null,
                mutableListOf(RoleType.STANDARD),
                banned = false,
                enabled = true, //TODO: Change to false when email verification is implemented
                info.provider
            )

            return@orElseGet userRepository
                .save(user)
        }).id!!

        if (result.isPresent)
        {
            authService.handleRegistration(
                worker.handle(token)
            )
        }

        val pair = jwtGenerationService.generateTokenPair(
            uuid
        )

        val responseContent = JwtTokenPairDto(
            pair.first,
            pair.second
        )

        response.status = HttpServletResponse.SC_OK
        response.writer.write(
            jacksonObjectMapper.writeValueAsString(responseContent)
        )
    }
}