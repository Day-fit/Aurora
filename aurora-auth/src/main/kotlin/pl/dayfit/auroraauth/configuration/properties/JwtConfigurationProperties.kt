package pl.dayfit.auroraauth.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.time.Duration

@ConfigurationProperties("jwt")
class JwtConfigurationProperties {
    var accessTokenValidity: Duration = Duration.parse("15m")
    var refreshTokenValidity: Duration = Duration.parse("14d")
}