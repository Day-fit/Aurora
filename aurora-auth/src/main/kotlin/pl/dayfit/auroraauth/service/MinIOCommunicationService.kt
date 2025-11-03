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
        jwtClaimsService.jwksSupplier = Supplier { JWKSet(jwksCacheService.getJwks()) }
    }

    fun saveNewKey(publicKey: OctetKeyPair, index: Int)
    {
        if (publicKey.isPrivate) throw IllegalArgumentException("Private key is not allowed")

        val jwks: MutableList<JWK> = try {
            jwksCacheService.getJwks()
        } catch (_: Exception) {
            mutableListOf()
        }

        jwks.add(index, publicKey)

        val mapper = jacksonObjectMapper()
        minioAsyncClient.putObject(
            PutObjectArgs.builder()
                .bucket(jwksConfigurationProperties.bucketName)
                .`object`(jwksConfigurationProperties.fileName)
                .stream(mapper.writeValueAsString(jwks).byteInputStream(), -1, 5 * 1024 * 1024)
                .build()
        )

        jwksCacheService.setJwks(jwks)
    }
}