package pl.dayfit.auroraai.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.openai.client.OpenAIClient
import com.openai.models.ChatModel
import com.openai.models.responses.ResponseCreateParams
import com.rabbitmq.stream.Consumer
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PostConstruct
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroraai.dto.EnhanceRequestDto
import pl.dayfit.auroraai.event.EnhanceDoneEvent
import pl.dayfit.auroraai.event.EnhanceRequestedEvent
import pl.dayfit.auroraai.exception.AiEnhancementFailedException
import java.nio.charset.StandardCharsets

@Service
class EnhancementService(
    val client: OpenAIClient, val streamsEnvironment: Environment,
    private val streamTemplate: RabbitStreamTemplate,
    private val applicationEventPublisher: ApplicationEventPublisher
) {
    lateinit var consumer: Consumer
    private val logger = org.slf4j.LoggerFactory.getLogger(EnhancementService::class.java)

    @PostConstruct
    fun init() {
        consumer = streamsEnvironment.consumerBuilder()
            .stream("enhancement_stream")
            .offset(OffsetSpecification.next())
            .messageHandler { _, record ->
                run {
                    val json = String(record.bodyAsBinary, StandardCharsets.UTF_8)
                    logger.trace("Enhancement requested: {}", json)

                    applicationEventPublisher.publishEvent(
                        this.mapToEvent(json)
                    )
                }
            }
            .build()
    }

    @EventListener
    fun enhance(event: EnhanceRequestedEvent)
    {
        val params = ResponseCreateParams.builder()
            .model(ChatModel.GPT_4O_MINI)
            .store(false)
            .input(
                """
            You are an expert resume writer. Your task is to professionally enhance this resume so it aligns perfectly with the following job:
            - Title: ${event.title}
            - Description: ${event.description}
            
            Focus on maximizing the resume’s attractiveness and impact while staying completely truthful. Highlight the most relevant experience, measurable achievements, and key skills that best match the job requirements.
            
            Achievements to emphasize: ${event.achievementDescriptions.joinToString(", ")}
            Key skills to feature: ${event.skillsNames.joinToString(", ")}
            
            Maintain accuracy and honesty—do not invent or exaggerate facts. Use persuasive, confident, and natural language. Preserve the language of the provided data (if input is in Polish, output in Polish; if in English, output in English). Ensure the final result reads as a polished, high-impact professional resume.
            """
            )
            .text(EnhanceRequestDto::class.java)
            .build()

        val response = client.responses()
            .create(params)
            .output()
            .stream()
            .flatMap { item -> item.message().stream() }
            .flatMap { message -> message.content().stream() }
            .map { content -> content.outputText() }
            .findFirst()
            .orElseThrow { AiEnhancementFailedException("Enhancement failed.") }
            .get()

        streamTemplate.convertAndSend(
            EnhanceDoneEvent(
                event.id,
                response.newTitle,
                response.newDescription,
                response.newAchievementDescriptions,
                response.newSkillsNames
            )
        )

        logger.trace("Enhancement done: {}", event.id)
    }

    private fun mapToEvent(json: String): EnhanceRequestedEvent
    {
        return jacksonObjectMapper().readValue(
            json,
            EnhanceRequestedEvent::class.java
        )
    }
}