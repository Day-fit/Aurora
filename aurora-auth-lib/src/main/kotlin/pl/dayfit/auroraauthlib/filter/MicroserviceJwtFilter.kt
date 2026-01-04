package pl.dayfit.auroraauthlib.filter

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import pl.dayfit.auroraauthlib.auth.entrypoint.AuroraAuthenticationEntryPoint
import pl.dayfit.auroraauthlib.auth.provider.MicroserviceAuthProvider
import pl.dayfit.auroraauthlib.auth.token.MicroserviceTokenCandidate

@Component
class MicroserviceJwtFilter(
    private val microserviceAuthProvider: MicroserviceAuthProvider,
    private val auroraAuthenticationEntryPoint: AuroraAuthenticationEntryPoint
    ) : OncePerRequestFilter() {
    private val log = LoggerFactory.getLogger(this::class.java)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token: String? = request.getHeader("Authorization")?.let {
            if (!it.startsWith("Bearer ")) {
                filterChain.doFilter(request, response)
                log.trace("Token is not prefixed with Bearer, skipping")
                return
            }

            return@let it.substring(7)
        }

        if (token == null) {
            filterChain.doFilter(request, response)
            log.trace("Token is null, skipping")
            return
        }

        try {
            val authentication = microserviceAuthProvider.authenticate(
                MicroserviceTokenCandidate(token)
            )
            SecurityContextHolder.getContext().authentication = authentication
            filterChain.doFilter(request, response)
        } catch (ex: AuthenticationException) {
            SecurityContextHolder.clearContext()
            auroraAuthenticationEntryPoint.commence(request, response, ex)
        }
    }
}