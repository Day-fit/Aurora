package pl.dayfit.auroracore.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "minio")
class MinIOConfigurationProperties {
    lateinit var endpoint: String
    lateinit var password: String
    lateinit var username: String
}