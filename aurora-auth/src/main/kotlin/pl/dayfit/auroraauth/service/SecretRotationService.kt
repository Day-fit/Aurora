package pl.dayfit.auroraauth.service

import com.nimbusds.jose.jwk.Curve
import com.nimbusds.jose.jwk.KeyUse
import com.nimbusds.jose.jwk.gen.OctetKeyPairGenerator
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.configuration.properties.JwksConfigurationProperties
import pl.dayfit.auroraauth.event.JwksRotationEvent
import pl.dayfit.auroraauth.event.SecretRotatedEvent
import java.time.Instant
import java.util.Date
import java.util.concurrent.atomic.AtomicInteger

@Service
class SecretRotationService(
    val rabbitTemplate: RabbitTemplate,
    val jwksConfigurationProperties: JwksConfigurationProperties,
    private val minioCommunicationService: MinIOCommunicationService,
    private val applicationEventPublisher: ApplicationEventPublisher
) {
    private val currentKeyId = AtomicInteger(0)
    private var firstRotation = true

    fun rotateSecret() {
        val keyId = currentKeyId.get()

        val newSecret = OctetKeyPairGenerator(Curve.X25519)
            .keyUse(KeyUse.SIGNATURE)
            .keyID(keyId.toString())
            .issueTime(Date())
            .generate()

        var validFrom = Instant.now().plusMillis(
            jwksConfigurationProperties
                .validFromDelay
                .inWholeMilliseconds
        )

        if(firstRotation) {
            validFrom = Instant.now()
            firstRotation = false
        }

        rabbitTemplate.convertAndSend(
            "jwks.exchange",
            "",
            JwksRotationEvent(
                keyId,
                Instant.now(),
                validFrom
            )
        )

        minioCommunicationService
            .saveNewKey(newSecret.toPublicJWK(), keyId)

        applicationEventPublisher
            .publishEvent(SecretRotatedEvent(
                newSecret
            ))
    }
}