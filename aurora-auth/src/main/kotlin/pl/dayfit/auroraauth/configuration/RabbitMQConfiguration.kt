package pl.dayfit.auroraauth.configuration

import org.springframework.amqp.support.converter.JacksonJsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitMQConfiguration {
    @Bean
    fun messageConverter(): MessageConverter
    {
        return JacksonJsonMessageConverter()
    }
}