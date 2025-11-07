package pl.dayfit.auroraauth.service

import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.auth.provider.OAuth2Provider
import pl.dayfit.auroraauth.auth.token.OAuth2TokenCandidate
import pl.dayfit.auroraauth.dto.request.OAuthTokenExchangeDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import java.util.UUID

@Service
class OAuthService(
    private val oauthAuthenticationProvider: OAuth2Provider,
    private val jwtGenerationService: JwtGenerationService
) {
    fun handleLogin(oauthTokenExchangeDto: OAuthTokenExchangeDto): JwtTokenPairDto {
        val token = oauthAuthenticationProvider
            .authenticate(
                OAuth2TokenCandidate(
                    oauthTokenExchangeDto.provider,
                    oauthTokenExchangeDto.accessToken
                )
            )

        val jwtPair = jwtGenerationService
            .generateTokenPair(
                token.principal as UUID
            )

        return JwtTokenPairDto(
            jwtPair.first,
            jwtPair.second
        )
    }
}