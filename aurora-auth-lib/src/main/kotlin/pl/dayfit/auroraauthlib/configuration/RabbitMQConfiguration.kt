package pl.dayfit.auroraauthlib.configuration

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class RabbitMQConfiguration {
    @Bean
    fun rabbitObjectMapper(): ObjectMapper {
        val mapper = ObjectMapper()
        mapper.registerModule(JavaTimeModule())
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        mapper.registerModule(KotlinModule.Builder().build())
        return mapper
    }

    @Bean
    fun messageConverter(rabbitObjectMapper: ObjectMapper): MessageConverter =
        Jackson2JsonMessageConverter(rabbitObjectMapper)
}