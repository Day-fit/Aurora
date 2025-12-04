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
import pl.dayfit.auroraai.dto.AutoGenerationDto
import pl.dayfit.auroraai.event.AutoGenerationDoneEvent
import pl.dayfit.auroraai.event.AutoGenerationRequestedEvent
import pl.dayfit.auroraai.exception.AutoGenerationFailedException

@Service
class AutoGenerationService(
    private val client: OpenAIClient,
    streamsEnvironment: Environment,
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val postAutoGenerationTemplate: RabbitStreamTemplate
) {
    private val logger = org.slf4j.LoggerFactory.getLogger(AutoGenerationService::class.java)

private val consumer = streamsEnvironment.consumerBuilder()
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
    .build()

    @PreDestroy
    private fun destroy() {
        consumer.close()
    }

    @EventListener
    fun handleAutoGeneration(event: AutoGenerationRequestedEvent)
    {
        val information = event.information

        val helpersFormatted = information.helpers.joinToString("\n") {
            "- ${it.name}: ${it.value}"
        }

        val prompt = """
        You are an information mapper. Follow STRICT factual rules.
        
        GOAL
        - First choose best WORK EXPERIENCE/PORTFOLIO/EDUCATION
        - Create an AutoGenerationDto JSON for job: ${event.title}
        - Use ALL SOURCE DATA.
        - Sort data by importance (best first, worst last).
        
        RULES
        - WORK EXPERIENCE: pick max 3–4 strongest (if any).
        - PORTFOLIO: pick max 3–4 strongest personal projects/repos (for given work); each must have a factual description based ONLY on source data. No placeholders.
        - EDUCATION: include only explicitly stated items.
        - Preserve ALL exact tech names (protocols (e.g. X3DH), algorithms (e.g. AES256), frameworks (e.g. Flask), libraries). No replacements. Highlight advanced/rare tech.
        
        CONSTRAINTS
        - NO hallucinations: no invented companies, schools, dates, tech, URLs, contacts, images.
        - No generic placeholders of any kind.
        - Content may be copied or paraphrased from source; empty string MUST be used for missing data.
        - Project/experience descriptions MUST include mentioned technologies.
        - No duplicates.
        - Do not put PORTFOLIO related data into WORK EXPERIENCE
        - If cannot be distinct if data if PORTFOLIO or WORK EXPERIENCE assume it's PORTFOLIO.
        - Do not put data into PORTFOLIO and WORK EXPERIENCE at the same time.  
        
        SOURCE DATA:
        SOURCE OF DATA: ${event.source}
        Description: ${information.description}
        Additional: $helpersFormatted
        END
        """.trimIndent()


        val params = ResponseCreateParams.builder()
            .model(ChatModel.GPT_5_NANO)
            .store(false)
            .input(prompt)
            .text(AutoGenerationDto::class.java)
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
            AutoGenerationDoneEvent(
                event.id,
                response
            )
        )

        logger.trace("Auto generation done.")
    }
}