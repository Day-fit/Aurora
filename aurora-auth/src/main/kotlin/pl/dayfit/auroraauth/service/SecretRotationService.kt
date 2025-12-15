package pl.dayfit.auroraauth.service

import com.nimbusds.jose.jwk.Curve
import com.nimbusds.jose.jwk.KeyUse
import com.nimbusds.jose.jwk.gen.OctetKeyPairGenerator
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.event.JwksRotationEvent
import pl.dayfit.auroraauth.event.SecretRotatedEvent
import java.time.Instant
import java.util.Date
import java.util.concurrent.atomic.AtomicInteger

@Service
class SecretRotationService(
    val rabbitTemplate: RabbitTemplate,
    private val minioCommunicationService: MinIOCommunicationService,
    private val applicationEventPublisher: ApplicationEventPublisher
) {
    private val currentKeyId = AtomicInteger(0)

    fun rotateSecret() {
        val keyId = currentKeyId.get()

        val newSecret = OctetKeyPairGenerator(Curve.Ed25519)
            .keyUse(KeyUse.SIGNATURE)
            .keyID(keyId.toString())
            .issueTime(Date())
            .generate()

        rabbitTemplate.convertAndSend(
            "jwks.exchange",
            "",
            JwksRotationEvent(
                keyId,
                Instant.now(),
                Instant.now()
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