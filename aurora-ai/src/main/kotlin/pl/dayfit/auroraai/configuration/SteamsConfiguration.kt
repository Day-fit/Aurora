package pl.dayfit.auroraai.configuration

import com.rabbitmq.stream.Address
import com.rabbitmq.stream.Environment
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate

@Configuration
@EnableConfigurationProperties(StreamsConfigurationProperties::class)
class SteamsConfiguration {
    @Bean
    fun streamsEnvironment(config: StreamsConfigurationProperties): Environment
    {
        val port = 5552
        val entrypoint = Address(config.host, port)

        return Environment.builder()
            .username(config.username)
            .password(config.password)
            .host(entrypoint.host())
            .port(entrypoint.port())
            .addressResolver { entrypoint }
            .build()
    }

    @Bean
    fun streamTemplate(streamsEnvironment: Environment): RabbitStreamTemplate
    {
        val template = RabbitStreamTemplate(streamsEnvironment, "generation_stream")
        template.setMessageConverter(JacksonJsonMessageConverter())

        return template
    }
}