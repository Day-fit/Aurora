package pl.dayfit.auroraauth.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "oauth2")
class OAuthConfigurationProperties {
    lateinit var googleClientId: String
    lateinit var googleClientSecret: String
    lateinit var googleUserInfoUri: String
    lateinit var googleRedirectUri: String
    lateinit var googleTokenUri: String

    lateinit var githubClientId: String
    lateinit var githubClientSecret: String
    lateinit var githubRedirectUri: String
    lateinit var githubUserInfoUri: String
    lateinit var githubTokenUri: String
    lateinit var githubScope: List<String>

    lateinit var linkedInClientId: String
    lateinit var linkedInClientSecret: String
    lateinit var linkedInRedirectUri: String
}