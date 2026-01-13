package pl.dayfit.auroraauthlib.configuration

import jakarta.servlet.DispatcherType
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import pl.dayfit.auroraauthlib.auth.provider.MicroserviceAuthProvider
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
    fun authenticationManager(
        http: HttpSecurity,
        provider: MicroserviceAuthProvider
    ): AuthenticationManager {
        val manager = ProviderManager(provider)
        http.authenticationManager(manager)
        return manager
    }

    @Bean
    @Order(2)
    fun filterChain(
        http: HttpSecurity,
        microserviceJwtFilter: MicroserviceJwtFilter,
        corsConfigurationSource: CorsConfigurationSource,
        publicPathsConfigurationProperties: PublicPathsConfigurationProperties,
    ): SecurityFilterChain {
        val paths = publicPathsConfigurationProperties.paths.toTypedArray()

        return http
            .securityMatcher("/**")
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource) }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .addFilterBefore(microserviceJwtFilter, UsernamePasswordAuthenticationFilter::class.java)
            .authorizeHttpRequests { auth ->
                auth
                    .dispatcherTypeMatchers(DispatcherType.ASYNC).permitAll()
                    .requestMatchers(*paths).permitAll()
                    .anyRequest().authenticated()
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