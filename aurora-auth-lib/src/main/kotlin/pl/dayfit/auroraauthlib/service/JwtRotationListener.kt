package pl.dayfit.auroraauthlib.service

import com.nimbusds.jose.jwk.JWKSet
import com.rabbitmq.client.Channel
import jakarta.annotation.PostConstruct
import org.apache.logging.log4j.util.Supplier
import org.slf4j.LoggerFactory
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.amqp.support.AmqpHeaders
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.Header
import org.springframework.stereotype.Service
import org.springframework.web.client.ResourceAccessException
import org.springframework.web.client.RestTemplate
import pl.dayfit.auroraauthlib.configuration.properties.JWKSConfigurationProperties
import pl.dayfit.auroraauthlib.event.JwksKeyRotationEvent
import java.io.IOException
import java.io.SyncFailedException
import java.text.ParseException
import java.time.Duration
import java.time.Instant

@Service
@ConditionalOnProperty(value = ["key-listener.enabled"], havingValue = "true")
@EnableConfigurationProperties(JWKSConfigurationProperties::class)
class JwtRotationListener(
    private val jwksConfigurationProperties: JWKSConfigurationProperties,
    private val jwtClaimsService: JwtClaimsService
) {
    private val log = LoggerFactory.getLogger(JwtRotationListener::class.java)

    lateinit var jwks: JWKSet

    @PostConstruct
    private fun init() {
        try {
            jwtClaimsService.jwksSupplier = Supplier { jwks }
            updateJwks()
            log.info("JWKS synchronization went successful")
        } catch (ex: ResourceAccessException) {
            log.warn("JWKS synchronization failed, given URI is unreachable", ex)
        } catch (ex: SyncFailedException) {
            log.warn("Could not update JWKS", ex)
        } catch (ex: ParseException) {
            log.warn("Could not parse JWKS", ex)
        }
    }

    /**
     * Handles receiving public keys from `auth` microservice.
     * @param keyRotationEvent DTO representing a public key rotation event.
     */
    @RabbitListener(queues = [$$"service.${service.name}"])
    private fun handleKeyRotation(
        keyRotationEvent: JwksKeyRotationEvent,
        channel: Channel,
        @Header(AmqpHeaders.DELIVERY_TAG) tag: Long
    ) {
        try {
            updateJwks()
            val delay = Duration.between(keyRotationEvent.issuedAt, Instant.now())
            log.info("Key rotation success. Delay ${delay.toMillis()} ms")
        } catch (e: Exception) {
            log.warn("NACKing message", e)
            try {
                channel.basicNack(tag, false, true)
            } catch (ioE: IOException) {
                throw RuntimeException(ioE)
            }
        }
    }

    /**
     * Fetches current JWK Set of public keys, handles message NACK management.
     * @throws SyncFailedException when JWKS sync fails (response != 2XX)
     * @throws ResourceAccessException when the URI is unreachable
     * @throws ParseException when JWKSet parsing fails
     */
    @Throws(SyncFailedException::class, ParseException::class, ResourceAccessException::class)
    private fun updateJwks() {
        val restTemplate = RestTemplate()
        val response: ResponseEntity<String> =
            restTemplate.getForEntity(jwksConfigurationProperties.uri, String::class.java)

        val body = response.body
        if (!response.statusCode.is2xxSuccessful || body.isNullOrEmpty())
            throw SyncFailedException("JWKS could not be updated")

        jwks = JWKSet.parse(body)
    }
}
