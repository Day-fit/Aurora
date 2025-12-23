package pl.dayfit.auroraauth.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfigurationSource
import pl.dayfit.auroraauth.oauth.OAuthSuccessHandler

@Configuration
class OAuthConfiguration {
    @Bean
    fun oauthFilterChain(
        http: HttpSecurity,
        corsConfigurationSource: CorsConfigurationSource,
        oAuthSuccessHandler: OAuthSuccessHandler
    ): SecurityFilterChain {
        return http
            .securityMatcher("/oauth2/authorization/**")
            .oauth2Login { it.successHandler { request, response, authentication ->
                oAuthSuccessHandler.onAuthenticationSuccess(
                    request, response, authentication
                )
            } }
            .cors { it.configurationSource(corsConfigurationSource)}
            .csrf { it.disable() }
            .build()
    }
}