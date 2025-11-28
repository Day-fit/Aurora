package pl.dayfit.auroraauthlib.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("public-paths")
class PublicPathsConfigurationProperties {
    lateinit var paths: List<String>
}