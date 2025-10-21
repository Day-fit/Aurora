package pl.dayfit.auroraai.service

import com.openai.client.OpenAIClientAsync
import com.openai.models.ChatModel
import com.openai.models.responses.ResponseCreateParams
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import pl.dayfit.auroraai.event.EnhanceResumeEvent

@Service
class EnhancementService(val client: OpenAIClientAsync) {

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
                //TODO: send enhanced resume back to the user (RabbitMQ Streams)
            }
    }
}