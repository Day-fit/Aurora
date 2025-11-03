package pl.dayfit.auroraauth.service.cache

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.nimbusds.jose.jwk.JWK
import io.minio.GetObjectArgs
import io.minio.MinioAsyncClient
import io.minio.errors.ErrorResponseException
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.configuration.properties.JwksConfigurationProperties

@Service
class JwksCacheService(
    private val minIOAsyncClient: MinioAsyncClient,
    private val jwksConfigurationProperties: JwksConfigurationProperties,
) {

    @Throws(ErrorResponseException::class)
    @Cacheable(value = ["jwks"], key = "'jwks.json'")
    fun getJwks(): MutableList<JWK> {
        return minIOAsyncClient.getObject(
            GetObjectArgs.builder()
                .bucket(jwksConfigurationProperties.bucketName)
                .`object`(jwksConfigurationProperties.fileName)
                .build()
        ).thenApply {
            val jwkJson: String = it.use { it.reader().readText() }
            return@thenApply parseJwkList(jwkJson)
        }.get()
    }

    @CachePut(value = ["jwks"], key = "'jwks.json'")
    fun setJwks(listJwk: MutableList<JWK>): MutableList<JWK> {
        return listJwk
    }

    fun parseJwkList(json: String): MutableList<JWK> {
        val mapper = jacksonObjectMapper()
        val root = mapper.readTree(json)
        val keysNode = root["keys"] ?: error("Missing 'keys' field in JWK Set JSON")
        val jwkList: List<Map<String, Any>> = mapper.readValue(keysNode.toString())
        return jwkList.map { JWK.parse(it) }.toMutableList()
    }
}