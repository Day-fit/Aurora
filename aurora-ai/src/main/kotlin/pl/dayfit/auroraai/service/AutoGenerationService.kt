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
            You are an expert resume writer with STRICT constraints on facts.

            Goal:
            - Create an AutoGenerationDto representing a strong, concise resume tailored to this job:
              - Job title: ${event.title}
            - Use ALL SOURCE DATA provided below (profile information, descriptions, projects, notes, etc.).
            - Carefully scan the entire source, do NOT limit yourself to the first paragraph or section.

            Experience & Education:
            - For EXPERIENCE: choose the 3–4 strongest, most relevant roles/projects/activities
              that BEST match the job and show the candidate's skills and impact.
            - For EDUCATION: extract any explicit education-related information (schools, degrees, courses, certificates).
            - You MAY rephrase, summarize and combine information from multiple places in the source,
              but you MUST NOT invent new facts.

            VERY IMPORTANT – KEEP CRUCIAL TECH DETAILS:
            - If the source mentions specific technologies, protocols, algorithms, frameworks, or libraries
              (for example: "end-to-end encrypted messenger using X3DH"),
              you MUST:
              - keep these names in the final description (e.g. "end-to-end encrypted messenger using X3DH"),
              - NOT replace them with more generic or different technologies
                (e.g. do NOT turn "X3DH" into "STOMP" or another protocol).
            - Prefer to highlight advanced or rare technologies (cryptography, security protocols, distributed systems, etc.)
              because they are attractive for a resume.
            - You may add short clarifications, e.g. "end-to-end encrypted messenger using the X3DH key agreement protocol",
              but the core names MUST stay exactly as in the source.

            Hard constraints (NO HALLUCINATIONS):
            - Do NOT create:
              - fake company names,
              - fake school names,
              - fake dates,
              - fake technologies or tools,
              - fake URLs, profile images, emails, or phone numbers.
            - If a specific field cannot be supported by the source data, set it to null.
            - Do NOT use generic placeholder values like:
              - "example.com/image"
              - "john.doe@example.com"
              - dummy phone numbers, addresses or links.

            Output:
            - Return ONLY a JSON object that matches the AutoGenerationDto schema.
            - Fields may be:
              - directly copied from the source,
              - or paraphrased/combined summaries of what is in the source,
              - or null if the information is missing.
            - Make sure descriptions of projects/experience explicitly mention the key technologies found in the source.

            SOURCE DATA (may contain: descriptions of work, projects, studies, technologies, bio text, etc.):
            - Job description/source: ${event.source}
            - Description:
              ${information.description}

            - Additional info:
            $helpersFormatted

            END OF SOURCE DATA
        """.trimIndent()
        val params = ResponseCreateParams.builder()
            .model(ChatModel.GPT_4O_MINI)
            .store(false)
            .temperature(0.0)
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