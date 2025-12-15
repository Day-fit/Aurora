package pl.dayfit.auroraauth.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwks")
class JwksConfigurationProperties {
    lateinit var bucketName: String
    lateinit var fileName: String
}