package pl.dayfit.auroraai.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.openai.client.OpenAIClient
import com.openai.models.ChatModel
import com.openai.models.responses.ResponseCreateParams
import com.rabbitmq.stream.Environment
import com.rabbitmq.stream.OffsetSpecification
import jakarta.annotation.PreDestroy
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.rabbit.stream.producer.RabbitStreamTemplate
import org.springframework.stereotype.Service
import pl.dayfit.auroraai.dto.TranslationResumeAiDto
import pl.dayfit.auroraai.dto.TranslationResumeDto
import pl.dayfit.auroraai.event.TranslationDoneEvent
import pl.dayfit.auroraai.event.TranslationRequestedEvent
import pl.dayfit.auroraai.exception.TranslationFailedException
import java.nio.charset.StandardCharsets

@Service
class TranslationService(
    private val client: OpenAIClient,
    private val postTranslationStreamTemplate: RabbitStreamTemplate,
    private val applicationEventPublisher: ApplicationEventPublisher,
    streamsEnvironment: Environment
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(TranslationService::class.java)
    private val consumer = streamsEnvironment.consumerBuilder()
        .stream("translation.stream")
        .offset(OffsetSpecification.next())
        .messageHandler { _, record ->
            run {
                val json = String(record.bodyAsBinary, StandardCharsets.UTF_8)
                applicationEventPublisher.publishEvent(
                    jacksonObjectMapper()
                        .readValue(json, TranslationRequestedEvent::class.java)
                )
            }
        }
        .build()

    @PreDestroy
    private fun destroy()
    {
        consumer.close()
    }

    @EventListener
    private fun translate(event: TranslationRequestedEvent)
    {
        val resume = event.originalResume

        val params = ResponseCreateParams.builder()
            .model(ChatModel.GPT_4_1_NANO)
            .store(false)
            .input(
                """
                You are an expert translator. Your task is to translate this resume into ${event.targetLanguage}
                - Title: ${resume.title},
                - Description: ${resume.description},
                
                - Skills: ${resume.skillsNames.joinToString(", ")}
                - Achievements: ${resume.achievementsTitles.zip(resume.achievementsDescriptions)
                    .joinToString(", ") {(title, description) -> "$title: $description"}}
                    
                - Experiences: ${resume.experiencePositions.zip(resume.experienceDescriptions)
                    .joinToString( ", " ){(pos, desc) -> "$pos: $desc"}}
                
                - Education Majors: ${resume.educationMajors.joinToString(", ")}
                
                Keep everything as close to the original as possible.
            """
            )
            .text(TranslationResumeAiDto::class.java)
            .build()

        val response: TranslationResumeAiDto = client.responses()
            .create(params)
            .output()
            .stream()
            .flatMap { item -> item.message().stream() }
            .flatMap { message -> message.content().stream() }
            .map { content -> content.outputText() }
            .findFirst()
            .orElseThrow { TranslationFailedException("Translation failed.") }
            .get()

        postTranslationStreamTemplate.convertAndSend(
            TranslationDoneEvent(
                event.trackerId,
                event.targetLanguage,
                TranslationResumeDto(
                    resume.id,
                    response.title,
                    response.description,
                    response.achievementsTitles,
                    response.achievementsDescriptions,
                    response.skillsNames,
                    response.educationMajors,
                    response.experiencePositions,
                    response.experienceDescriptions
                )
            )
        )

        logger.trace("Translation done for resume {}.", event.originalResume.id)
    }
}