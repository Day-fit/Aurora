package pl.dayfit.auroraai.configuration

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "openai")
class OpenAiConfigurationProperties {
    lateinit var apiKey: String
    lateinit var organization: String
    lateinit var project: String
}