package pl.dayfit.auroracore.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "streams")
class StreamsConfigurationProperties {
    lateinit var host: String
    lateinit var username: String
    lateinit var password: String
}