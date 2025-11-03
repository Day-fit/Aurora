package pl.dayfit.auroraauthlib.configuration

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import pl.dayfit.auroraauthlib.configuration.properties.CorsConfigurationProperties
import pl.dayfit.auroraauthlib.configuration.properties.PublicPathsConfigurationProperties
import pl.dayfit.auroraauthlib.filter.MicroserviceJwtFilter

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(value = [
    CorsConfigurationProperties::class,
    PublicPathsConfigurationProperties::class
])
class SecurityConfiguration {

    @Bean
    fun filterChain(http: HttpSecurity, microserviceJwtFilter: MicroserviceJwtFilter, corsConfigurationSource: CorsConfigurationSource): SecurityFilterChain
    {
        return http
            .csrf { it.disable() } //Authorization through the bearer token. CSRF is not needed.
            .cors { it.configurationSource(corsConfigurationSource) }
            .addFilterBefore(microserviceJwtFilter, UsernamePasswordAuthenticationFilter::class.java)
            .authorizeHttpRequests {
                it.requestMatchers("/.well-known/jwks.json",
                    "/api/v1/auth/login", "/api/v1/auth/register" ).permitAll()
                it.anyRequest().authenticated()
            }
            .build()
    }

    @Bean
    fun corsConfigurationSource(corsConfigurationProperties: CorsConfigurationProperties): CorsConfigurationSource {
        val configuration = CorsConfiguration()

        configuration.allowedOrigins = corsConfigurationProperties.allowedOrigins
        configuration.allowedMethods = corsConfigurationProperties.allowedMethods
        configuration.allowedHeaders = corsConfigurationProperties.allowedHeaders
        configuration.exposedHeaders = corsConfigurationProperties.exposedHeaders
        configuration.allowCredentials = corsConfigurationProperties.allowCredentials
        configuration.maxAge = corsConfigurationProperties.maxAge

        val urlBasedCorsConfigurationSource = UrlBasedCorsConfigurationSource()
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration)
        return urlBasedCorsConfigurationSource
    }
}