package pl.dayfit.auroraauth.configuration.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "oauth2")
class OAuthConfigurationProperties {
    lateinit var googleClientId: String
    lateinit var googleClientSecret: String
    lateinit var googleUserInfoUri: String

    lateinit var githubClientId: String
    lateinit var githubClientSecret: String

    lateinit var appleClientId: String
    lateinit var appleClientSecret: String
    lateinit var appleJwksUri: String
}