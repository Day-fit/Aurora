package pl.dayfit.auroracore.configuration

import io.minio.MinioClient
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.dayfit.auroracore.configuration.properties.MinIOConfigurationProperties

@Configuration
@EnableConfigurationProperties(MinIOConfigurationProperties::class)
class MinIOConfiguration {
    @Bean
    fun minioClient(config: MinIOConfigurationProperties): MinioClient = MinioClient.builder()
        .endpoint(config.endpoint)
        .credentials(config.username, config.password)
        .build()
}