package pl.dayfit.auroraauth.service

import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.oauth.OAuth2Validator
import pl.dayfit.auroraauth.oauth.domain.OAuthUser
import pl.dayfit.auroraauth.type.AuthProvider
import java.security.NoSuchProviderException

@Service
class OAuthValidatorService(
    private val validators: List<OAuth2Validator>
) {
    fun validate(token: String, provider: AuthProvider): OAuthUser
    {
        val validator: OAuth2Validator? = validators.find {
            validator -> validator.supports(provider)
        }

        validator?: throw NoSuchProviderException(
            "Provider '${provider.name}' is not supported."
        )

        return validator.validate(token)
    }
}