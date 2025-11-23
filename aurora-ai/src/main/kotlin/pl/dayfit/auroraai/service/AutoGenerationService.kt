package pl.dayfit.auroraai.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.openai.client.OpenAIClient
import com.openai.models.ChatModel
import com.openai.models.responses.ResponseCreateParams
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PostConstruct
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroraai.event.AutoGenerationDoneEvent
import pl.dayfit.auroraai.event.AutoGenerationRequestedEvent
import pl.dayfit.auroraai.exception.AutoGenerationFailedException

@Service
class AutoGenerationService(
    private val client: OpenAIClient,
    private val streamsEnvironment: Environment,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val postAutoGenerationTemplate: RabbitStreamTemplate
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(AutoGenerationService::class.java)

    @PostConstruct
    fun init() {
        streamsEnvironment.consumerBuilder()
            .stream("autogeneration.stream")
            .offset(OffsetSpecification.next())
            .messageHandler { _, record ->
                run {
                    val json = String(record.bodyAsBinary, Charsets.UTF_8)
                    applicationEventPublisher.publishEvent(
                        jacksonObjectMapper().readValue(json,
                            AutoGenerationRequestedEvent::class.java)
                    )
                }
            }
    }

    @EventListener
    fun handleAutoGeneration(event: AutoGenerationRequestedEvent)
    {
        val params = ResponseCreateParams.builder()
            .model(ChatModel.GPT_4_1_NANO)
            .store(false)
            .input("""
               You are an expert resume writer. Your task is to automatically generate a resume for the following job:
                - Title: ${event.title}
                - Description (from ${event.source}: ${event.description}
                - Additional info: ${event.helpers.map { 
                    "${it.name}: ${it.value},"
            }}
              Try to find as many details as possible, keep null if not found.
            """)
            .text(AutoGenerationDoneEvent::class.java)
            .build()

        val response = client.responses()
            .create(params)
            .output()
            .stream()
            .flatMap { item -> item.message().stream() }
            .flatMap { message -> message.content().stream() }
            .map { content -> content.outputText() }
            .findFirst()
            .orElseThrow { AutoGenerationFailedException("Auto generation failed.") }
            .get()

        postAutoGenerationTemplate.convertAndSend(
            response
        )

        logger.trace("Auto generation done.")
    }
}