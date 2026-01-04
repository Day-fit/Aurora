package pl.dayfit.auroracore.service

import io.minio.MakeBucketArgs
import io.minio.MinioClient
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.event.UserReadyForInitializingEvent

/**
 * Service responsible for initializing users in the system.
 *
 * This service is expected to manage processes related to user setup
 * and initialization, ensuring users are correctly prepared for interaction
 * with the application. Its exact responsibilities can include tasks such as
 * creating a user bucket in object storage, etc.
 */
@Service
class InitUserService(
    private val minioClient: MinioClient
) {
    @RabbitListener(queues = ["user.init.core"])
    fun initUser(event: UserReadyForInitializingEvent) {
        minioClient.makeBucket(
            MakeBucketArgs.builder()
                .bucket(event.userId)
                .build()
        )
    }
}