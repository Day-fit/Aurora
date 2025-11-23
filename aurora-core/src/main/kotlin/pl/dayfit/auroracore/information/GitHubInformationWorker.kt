package pl.dayfit.auroracore.information

import org.springframework.http.HttpEntity
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import pl.dayfit.auroracore.configuration.properties.InformationHandlersConfigurationProperties
import pl.dayfit.auroracore.dto.InformationDto
import pl.dayfit.auroracore.type.AutoGenerationSource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.web.client.exchange

@Component
class GitHubInformationWorker(
    private val informationRestTemplate: RestTemplate,
    private val props: InformationHandlersConfigurationProperties
) : InformationWorker {
    private val headers = HttpHeaders().apply {
        setBearerAuth(props.githubPat)
    }

    override fun processInformation(name: String): InformationDto {
        val userInfo = informationRestTemplate.exchange<Map<String, Any>>(
            props.githubUserInfoUri + "/$name",
            HttpMethod.GET,
            HttpEntity<Void>(headers),
        )

        //TODO To be implemented
        return InformationDto(

        )
    }

    override fun supports(source: AutoGenerationSource): Boolean {
        return source == AutoGenerationSource.GITHUB
    }
}