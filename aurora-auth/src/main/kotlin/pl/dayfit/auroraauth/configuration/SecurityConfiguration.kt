package pl.dayfit.auroraauth.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Configuration
class SecurityConfiguration {

    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()
}