package pl.dayfit.auroraauth.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "aurora.cookies")
class CookiesConfigurationProperties {
    var secure: Boolean = false
}