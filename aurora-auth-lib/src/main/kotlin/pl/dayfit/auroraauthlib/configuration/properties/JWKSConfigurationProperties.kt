package pl.dayfit.auroraauthlib.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwks")
class JWKSConfigurationProperties {
    lateinit var uri: String
}