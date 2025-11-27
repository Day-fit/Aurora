package pl.dayfit.auroracore.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "information.handlers")
data class InformationHandlersConfigurationProperties (
    var githubPat: String?, //Might be null, but setting it is recommended
    var githubUserInfoUri: String = "https://api.github.com/users/{username}",
    var githubUserReposUri: String = "https://api.github.com/users/{owner}/repos",
    var githubReposContentUri: String = "https://api.github.com/repos/{owner}/{repo}/contents/{path}"
)