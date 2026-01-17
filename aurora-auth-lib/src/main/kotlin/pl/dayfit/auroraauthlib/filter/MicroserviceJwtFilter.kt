package pl.dayfit.auroraauthlib.filter

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.util.AntPathMatcher
import org.springframework.web.filter.OncePerRequestFilter
import pl.dayfit.auroraauthlib.auth.entrypoint.AuroraAuthenticationEntryPoint
import pl.dayfit.auroraauthlib.auth.provider.MicroserviceAuthProvider
import pl.dayfit.auroraauthlib.auth.token.MicroserviceTokenCandidate
import pl.dayfit.auroraauthlib.configuration.properties.PublicPathsConfigurationProperties

@Component
class MicroserviceJwtFilter(
    private val publicPathsConfigurationProperties: PublicPathsConfigurationProperties,
    private val microserviceAuthProvider: MicroserviceAuthProvider,
    private val auroraAuthenticationEntryPoint: AuroraAuthenticationEntryPoint
    ) : OncePerRequestFilter() {
    private val log = LoggerFactory.getLogger(this::class.java)
    private val pathMatcher = AntPathMatcher()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authorizationHeader = request.getHeader("Authorization")
        val accessToken = authorizationHeader
            ?.takeIf { it.startsWith("Bearer ") }
            ?.removePrefix("Bearer ")
            ?.trim()

        if (accessToken == null) {
            filterChain.doFilter(request, response)
            log.trace("Access token not found, skipping")
            return
        }

        val uri = request.requestURI
        val isPublic: Boolean = publicPathsConfigurationProperties.paths.any { pattern ->
            pathMatcher.match(pattern, uri)
        }

        try {
            val authentication = microserviceAuthProvider.authenticate(
                MicroserviceTokenCandidate(accessToken)
            )
            SecurityContextHolder.getContext().authentication = authentication
            filterChain.doFilter(request, response)
        } catch (ex: AuthenticationException) {
            SecurityContextHolder.clearContext()

            //For optional auth
            if (isPublic) {
                filterChain.doFilter(request, response)
                return
            }

            auroraAuthenticationEntryPoint.commence(request, response, ex)
        }
    }
}
