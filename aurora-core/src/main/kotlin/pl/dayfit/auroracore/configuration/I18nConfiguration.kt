package pl.dayfit.auroracore.configuration

import org.springframework.context.MessageSource
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.support.ResourceBundleMessageSource

/**
 * Configuration for internationalization (i18n) support.
 * Configures MessageSource to load enum translations from properties files.
 */
@Configuration
class I18nConfiguration {
    
    @Bean
    fun messageSource(): MessageSource {
        val messageSource = ResourceBundleMessageSource()
        messageSource.setBasename("messages")
        messageSource.setDefaultEncoding("UTF-8")
        messageSource.setFallbackToSystemLocale(false)
        messageSource.setUseCodeAsDefaultMessage(true)
        return messageSource
    }
}
