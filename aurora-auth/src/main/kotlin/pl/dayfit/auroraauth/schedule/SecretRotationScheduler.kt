package pl.dayfit.auroraauth.schedule

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.service.SecretRotationService

@Component
class SecretRotationScheduler(
    val service: SecretRotationService,
) {
    @Scheduled(fixedRateString = $$"${jwks.rotation-rate}")
    fun scheduleRotation() = service.rotateSecret()
}