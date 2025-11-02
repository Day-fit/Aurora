package pl.dayfit.auroraauth.service

import com.nimbusds.jose.jwk.OctetKeyPair
import io.minio.MinioAsyncClient
import io.minio.PutObjectArgs
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.configuration.properties.JwksConfigurationProperties
import pl.dayfit.auroraauth.service.cache.JwksCacheService

@Service
class MinIOCommunicationService(
    private val jwksCacheService: JwksCacheService,
    private val minioAsyncClient: MinioAsyncClient,
    private val jwksConfigurationProperties: JwksConfigurationProperties
) {
    fun saveNewKey(publicKey: OctetKeyPair, index: Int)
    {
        if (publicKey.isPrivate) throw IllegalArgumentException("Private key is not allowed")

        val jwks = jwksCacheService.getJwks()
        jwks.keys[index] = publicKey

        minioAsyncClient.putObject(
            PutObjectArgs.builder()
                .bucket(jwksConfigurationProperties.bucketName)
                .`object`(jwksConfigurationProperties.fileName)
                .stream(jwks.toJSONObject().toString().byteInputStream(), -1, 1024 * 1024)
                .build()
        )

        jwksCacheService.setJwks(jwks)
    }
}