package pl.dayfit.auroraauth.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.nimbusds.jose.jwk.JWK
import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.OctetKeyPair
import io.minio.MinioAsyncClient
import io.minio.PutObjectArgs
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.configuration.properties.JwksConfigurationProperties
import pl.dayfit.auroraauth.service.cache.JwksCacheService
import pl.dayfit.auroraauthlib.service.JwtClaimsService
import java.util.function.Supplier

@Service
class MinIOCommunicationService(
    private val jwksCacheService: JwksCacheService,
    private val minioAsyncClient: MinioAsyncClient,
    private val jwksConfigurationProperties: JwksConfigurationProperties,
    jwtClaimsService: JwtClaimsService,
) {
    init {
        jwtClaimsService.jwksSupplier = Supplier { jwksCacheService.getJwks() }
    }

    fun saveNewKey(publicKey: OctetKeyPair, index: Int)
    {
        if (publicKey.isPrivate) throw IllegalArgumentException("Private key is not allowed")

        var jwks: JWKSet = try {
            val oldJwks = jwksCacheService.getJwks()
            val newKeys = oldJwks.keys
                .toMutableList()

            newKeys.add(index, publicKey.toPublicJWK())
            JWKSet(newKeys)
        } catch (_: Exception) {
            JWKSet(
                listOf<JWK>(publicKey.toPublicJWK())
            )
        }

        val jwksBytes = jacksonObjectMapper()
            .writeValueAsString(jwks.toJSONObject())
            .toByteArray(Charsets.UTF_8)

        minioAsyncClient.putObject(
            PutObjectArgs.builder()
                .bucket(jwksConfigurationProperties.bucketName)
                .`object`(jwksConfigurationProperties.fileName)
                .stream(jwksBytes.inputStream(), jwksBytes.size.toLong(), 5 * 1024 * 1024L)
                .contentType("application/json")
                .build()
        )

        jwksCacheService.setJwks(jwks)
    }
}