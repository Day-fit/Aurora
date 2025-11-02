package pl.dayfit.auroraauth.configuration

import io.minio.MinioAsyncClient
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.dayfit.auroraauth.configuration.properties.MinIOConfigurationProperties

@Configuration
@EnableConfigurationProperties(MinIOConfigurationProperties::class)
class MinIOConfiguration {
    @Bean
    fun minIOAsyncClient(properties: MinIOConfigurationProperties): MinioAsyncClient = MinioAsyncClient.builder()
        .endpoint(properties.endpoint)
        .credentials(properties.username, properties.password)
        .build()
}