package pl.dayfit.auroraauth.configuration

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate
import pl.dayfit.auroraauth.configuration.properties.OAuthConfigurationProperties
import java.time.Duration

@Configuration
@EnableConfigurationProperties(OAuthConfigurationProperties::class)
class OAuthConfiguration {
    @Bean
    fun oauthRestTemplate(restTemplateBuilder: RestTemplateBuilder): RestTemplate
    {
        return restTemplateBuilder
            .connectTimeout(Duration.ofSeconds(2)) //Response needs to be fast
            .build()
    }
}