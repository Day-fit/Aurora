package pl.dayfit.auroracore.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "information.handlers")
class InformationHandlersConfigurationProperties {
    lateinit var githubPat: String
    lateinit var githubUserInfoUri: String
    lateinit var githubUserReposUri: String
}