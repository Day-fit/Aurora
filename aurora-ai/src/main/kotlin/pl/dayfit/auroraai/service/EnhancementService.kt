package pl.dayfit.auroraai.service

import com.openai.client.OpenAIClientAsync
import com.openai.models.ChatModel
import com.openai.models.responses.ResponseCreateParams
import com.rabbitmq.stream.Consumer
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PostConstruct
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import pl.dayfit.auroraai.event.EnhanceResumeEvent
import tools.jackson.databind.ObjectMapper
import java.nio.charset.StandardCharsets

@Service
class EnhancementService(
    val client: OpenAIClientAsync, val streamsEnvironment: Environment,
    private val objectMapper: ObjectMapper,
    private val streamTemplate: RabbitStreamTemplate
) {
    lateinit var consumer: Consumer

    @PostConstruct
    fun init() {
        consumer = streamsEnvironment.consumerBuilder()
            .stream("enhancement_stream")
            .offset(OffsetSpecification.next())
            .messageHandler { _, record ->
                run {
                    val json = String(record.bodyAsBinary, StandardCharsets.UTF_8)
                    this.enhance(this.mapToEvent(json))
                }
            }
            .build()
    }

    @Async
    @EventListener
    fun enhance(event: EnhanceResumeEvent)
    {
        val params = ResponseCreateParams.builder()
            .model(ChatModel.GPT_4O_MINI)
            .store(false)
            .input("Hello, your role is to enhance this resume for following job ${event.title}." +
                    "description: ${event.description}, achievements description: ${event.achievementDescriptions.joinToString { ", " }}," +
                    " skills names: ${event.skillsNames.joinToString { ", " }}")
            .build()

        client.responses()
            .create(params)
            .thenApply { it.output() }
            .thenAccept {
                streamTemplate.convertAndSend(
                    //TODO: implement
                    ""
                )
            }
    }

    private fun mapToEvent(json: String): EnhanceResumeEvent
    {
        return objectMapper.readValue(
            json,
            EnhanceResumeEvent::class.java
        )
    }
}