package pl.dayfit.auroraauthlib.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "cors")
class CorsConfigurationProperties {
    lateinit var allowedOrigins: List<String>
    var allowedMethods: List<String> = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
    var allowedHeaders: List<String> = listOf("Authorization", "Content-Type")
    var exposedHeaders: List<String> = listOf("Authorization")
    var allowCredentials: Boolean = true
    var maxAge: Long = 3600L
}