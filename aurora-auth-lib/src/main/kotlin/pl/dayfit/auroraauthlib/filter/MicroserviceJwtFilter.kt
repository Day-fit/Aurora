package pl.dayfit.auroraauthlib.filter

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import pl.dayfit.auroraauthlib.auth.provider.MicroserviceAuthProvider
import pl.dayfit.auroraauthlib.auth.token.MicroserviceTokenCandidate

@Component
class MicroserviceJwtFilter(
    private val microserviceAuthProvider: MicroserviceAuthProvider,
    private val entryPoint: AuthenticationEntryPoint
    ) : OncePerRequestFilter() {
    private val log = LoggerFactory.getLogger(this::class.java)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val accessToken: String? = request.cookies
            ?.firstOrNull { it.name == "accessToken" }
            ?.value
        val refreshToken: String? = request.cookies
            ?.firstOrNull { it.name == "refreshToken" }
            ?.value

        if (accessToken == null && refreshToken == null) {
            filterChain.doFilter(request, response)
            log.trace("Both accessToken and refreshToken cookies are missing, skipping")
            return
        }

        val tokenToUse = accessToken ?: refreshToken

        if (tokenToUse == null) {
            filterChain.doFilter(request, response)
            log.trace("No valid token found, skipping")
            return
        }

        runCatching {
            val authentication = microserviceAuthProvider.authenticate(
                MicroserviceTokenCandidate(tokenToUse)
            )
            SecurityContextHolder.getContext().authentication = authentication
        }.onFailure { ex ->
            SecurityContextHolder.clearContext()
            val authException = ex as? AuthenticationException ?: BadCredentialsException(
                ex.message ?: "Authentication failed"
            )

            entryPoint.commence(
                request, response, authException
            )
        }

        filterChain.doFilter(request, response)
    }
}