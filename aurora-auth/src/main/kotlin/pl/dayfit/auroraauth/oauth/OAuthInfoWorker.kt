package pl.dayfit.auroraauth.oauth

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import pl.dayfit.auroraauth.type.AuthProvider

interface OAuthInfoWorker {
    fun handle(oauthToken: OAuth2AuthenticationToken): OAuthUserInfo
    fun supports(provider: AuthProvider): Boolean
}