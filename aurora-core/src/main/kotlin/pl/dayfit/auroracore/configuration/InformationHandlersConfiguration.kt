package pl.dayfit.auroracore.configuration

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate
import pl.dayfit.auroracore.configuration.properties.InformationHandlersConfigurationProperties

@Configuration
@EnableConfigurationProperties(InformationHandlersConfigurationProperties::class)
class InformationHandlersConfiguration
{
    @Bean
    fun informationRestTemplate(): RestTemplate
    {
        return RestTemplate()
    }
}