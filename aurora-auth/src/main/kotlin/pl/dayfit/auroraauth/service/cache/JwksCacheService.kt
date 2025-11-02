package pl.dayfit.auroraauth.service.cache

import com.nimbusds.jose.jwk.JWKSet
import io.minio.GetObjectArgs
import io.minio.MinioAsyncClient
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.configuration.properties.JwksConfigurationProperties

@Service
class JwksCacheService(
    private val minIOAsyncClient: MinioAsyncClient,
    private val jwksConfigurationProperties: JwksConfigurationProperties
) {
    @Cacheable(value = ["jwks"], key = "'jwks.json'")
    fun getJwks(): JWKSet {
        return minIOAsyncClient.getObject(
            GetObjectArgs.builder()
                .bucket(jwksConfigurationProperties.bucketName)
                .`object`(jwksConfigurationProperties.fileName)
                .build()
        ).thenApply {
            JWKSet.parse(it.use { it.reader().readText() })
        }.get()
    }

    @CachePut(value = ["jwks"], key = "'jwks.json'")
    fun setJwks(jwks: JWKSet): JWKSet {
        return jwks
    }
}