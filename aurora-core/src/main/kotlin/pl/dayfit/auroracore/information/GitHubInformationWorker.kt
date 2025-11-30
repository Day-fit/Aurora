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
import kotlin.collections.filter
import kotlin.io.encoding.Base64

@Component
class GitHubInformationWorker(
    private val informationRestTemplate: RestTemplate,
    private val props: InformationHandlersConfigurationProperties
) : InformationWorker {
    private val logger = org.slf4j.LoggerFactory.getLogger(this::class.java)

private val headers: HttpHeaders = HttpHeaders().apply {
        val pat = if(props.githubPat?.isBlank() == false)
            props.githubPat!!
            else return@apply

        setBearerAuth(pat)
    }
    override fun processInformation(name: String): InformationDto {
        val url = props.githubUserReposUri
            .replace("{owner}", name)

        val userRepos = informationRestTemplate.exchange<List<Map<String, Any>>>(
            url,
            HttpMethod.GET,
            HttpEntity<Void>(headers)
        )

        if (!userRepos.statusCode.is2xxSuccessful)
        {
            throw InformationCollectingFailedException("Could not fetch user repos")
        }

        val readmes: List<InformationDto.InformationItem> = userRepos.body
            ?.mapNotNull { it["name"] as? String }
            ?.filter {repoName -> repoName.equals(name, ignoreCase = true)}
            ?.map { repoName ->
                InformationDto.InformationItem(
                    repoName,
                    fetchReadmeContent(name, repoName)
                )
            } ?: emptyList()

        return InformationDto(
            fetchReadmeContent(name, name), // username/username README.md is used as a profile description
                readmes
        )
    }

    override fun supports(source: AutoGenerationSource): Boolean {
        return source == AutoGenerationSource.GITHUB
    }

    private fun fetchReadmeContent(owner: String, repo: String): String {
        val readmeResponse = informationRestTemplate.exchange<Map<String, Any>>(
            props.githubReposContentUri
                .replace("{owner}", owner)
                .replace("{repo}", repo)
                .replace("{path}", "README.md"),
            HttpMethod.GET,
            HttpEntity<Void>(headers)
        )

        if (!readmeResponse.statusCode.is2xxSuccessful)
        {
            throw InformationCollectingFailedException("Could not fetch README.md from $owner/$repo")
        }

        val readmeContent = readmeResponse.body?.get("content") as? String
        return readmeContent?.let { Base64.decode(it.replace("\n", "").trim()).decodeToString() } ?: ""
    }
}