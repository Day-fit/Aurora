package pl.dayfit.auroraauth.configuration

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import pl.dayfit.auroraauth.configuration.properties.CookiesConfigurationProperties

@Configuration
@EnableConfigurationProperties(CookiesConfigurationProperties::class)
class AuthConfiguration {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}