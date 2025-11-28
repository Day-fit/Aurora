package pl.dayfit.auroraauth.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.time.Duration

@ConfigurationProperties(prefix = "jwks")
class JwksConfigurationProperties {
    var validFromDelay: Duration = Duration.ZERO
    lateinit var bucketName: String
    lateinit var fileName: String
}