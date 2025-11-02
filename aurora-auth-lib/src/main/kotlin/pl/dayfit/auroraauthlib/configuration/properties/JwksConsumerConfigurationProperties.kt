package pl.dayfit.auroraauthlib.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwks.consumer")
class JwksConsumerConfigurationProperties {
    lateinit var uri: String
}