package pl.dayfit.auroraauthlib.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import pl.dayfit.auroraauthlib.auth.provider.MicroserviceAuthProvider
import pl.dayfit.auroraauthlib.exceptionhandler.AuthLibExceptionHandler
import pl.dayfit.auroraauthlib.filter.MicroserviceJwtFilter
import pl.dayfit.auroraauthlib.service.JwtClaimsService
import pl.dayfit.auroraauthlib.service.JwtRotationListener

@Configuration
@Import(value = [
    JwtClaimsService::class,
    JwtRotationListener::class,
    AuthLibExceptionHandler::class,
    MicroserviceAuthProvider::class,
    SecurityConfiguration::class,
    MicroserviceJwtFilter::class,
])
class AutoConfiguration