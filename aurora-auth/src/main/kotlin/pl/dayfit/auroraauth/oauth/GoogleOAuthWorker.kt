package pl.dayfit.auroraauth.oauth

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.stereotype.Component
import pl.dayfit.auroraauth.type.AuthProvider

@Component
class GoogleOAuthWorker : OAuthInfoWorker {
    override fun handle(oauthToken: OAuth2AuthenticationToken): OAuthUserInfo {
        val oauthUser = oauthToken.principal

        return OAuthUserInfo(
            oauthUser.attributes["name"] as String,
            oauthUser.attributes["email"] as String,
            AuthProvider.GOOGLE
        )
    }

    override fun supports(provider: AuthProvider): Boolean {
        return provider == AuthProvider.GOOGLE
    }
}