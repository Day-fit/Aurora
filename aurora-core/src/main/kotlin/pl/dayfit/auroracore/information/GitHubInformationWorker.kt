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
import pl.dayfit.auroracore.exception.InformationCollectingFailedException
import kotlin.io.encoding.Base64

@Component
class GitHubInformationWorker(
    private val informationRestTemplate: RestTemplate,
    private val props: InformationHandlersConfigurationProperties
) : InformationWorker {
    private val logger = org.slf4j.LoggerFactory.getLogger(this::class.java)

    private val headers = HttpHeaders().apply {
        props.githubPat.apply {
            if (this == null)
            {
                logger.warn("GitHub PAT is not set, some information handlers might not work," +
                        " request rate is limited")
                return@apply
            }

            setBearerAuth(props.githubPat!!)
        }
    }

    override fun processInformation(name: String): InformationDto {
        val userInfo = informationRestTemplate.exchange<Map<String, Any>>(
            props.githubUserInfoUri
                    .replace("{username}", name),
            HttpMethod.GET,
            HttpEntity<Void>(headers),
        )

        if (!userInfo.statusCode.is2xxSuccessful)
        {
            throw InformationCollectingFailedException("Could not fetch user info")
        }

        val bio = userInfo.body?.get("bio") as String?
            ?: throw InformationCollectingFailedException("User has no bio")

        val userRepos = informationRestTemplate.exchange<List<Map<String, Any>>>(
            props.githubUserReposUri
                .replace("{owner}", name),
            HttpMethod.GET,
            HttpEntity<Void>(headers)
        )

        if (!userRepos.statusCode.is2xxSuccessful)
        {
            throw InformationCollectingFailedException("Could not fetch user repos")
        }

        val readmes: List<InformationDto.InformationItem> = userRepos.body
            ?.mapNotNull { it["name"] as? String }
            ?.map { repoName ->
                val readmeResponse = informationRestTemplate.exchange<Map<String, Any>>(
                    props.githubReposContentUri
                        .replace("{owner}", name)
                        .replace("{repo}", repoName)
                        .replace("{path}", "README.md"),
                    HttpMethod.GET,
                    HttpEntity<Void>(headers)
                )
                val readmeContent = readmeResponse.body?.get("content") as? String
                val decodedReadme = readmeContent?.let { String(Base64.decode(it)) } ?: ""
                InformationDto.InformationItem(
                    repoName,
                    decodedReadme
                )
            } ?: emptyList()

        return InformationDto(
            bio,
                readmes
        )
    }

    override fun supports(source: AutoGenerationSource): Boolean {
        return source == AutoGenerationSource.GITHUB
    }
}