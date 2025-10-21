package pl.dayfit.auroraai.configuration

import com.openai.client.OpenAIClientAsync
import com.openai.client.okhttp.OpenAIOkHttpClientAsync
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(OpenAiConfigurationProperties::class)
class OpenAiConfiguration(val properties: OpenAiConfigurationProperties){

    @Bean
    fun client(): OpenAIClientAsync {
        return OpenAIOkHttpClientAsync
            .builder()
            .project(properties.project)
            .apiKey(properties.apiKey)
            .organization(properties.organization)
            .build()
    }
}