package pl.dayfit.auroracore.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "information.handlers")
data class InformationHandlersConfigurationProperties (
    var githubPat: String?, //Might be null, but setting it is recommended
    var githubUserInfoUri: String,
    var githubUserReposUri: String,
    var githubReposContentUri: String
)