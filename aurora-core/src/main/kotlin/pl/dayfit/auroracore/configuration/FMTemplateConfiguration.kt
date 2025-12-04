package pl.dayfit.auroracore.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FMTemplateConfiguration {
    @Bean
    fun templateConfiguration(): freemarker.template.Configuration
    {
        val config = freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_34)
        config.setClassForTemplateLoading(this.javaClass, "/templates")
        config.defaultEncoding = "UTF-8"
        config.templateExceptionHandler = freemarker.template.TemplateExceptionHandler.RETHROW_HANDLER

        return config
    }
}