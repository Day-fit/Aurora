package pl.dayfit.auroraauth.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroraauth.dto.request.OAuthTokenExchangeDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import pl.dayfit.auroraauth.service.OAuthService

@RestController
@RequestMapping("/oauth2")
class OAuth2Controller(
    private val oauthService: OAuthService
) {
    @PostMapping("/exchange")
    fun exchangeToken(tokenExchange: OAuthTokenExchangeDto): ResponseEntity<JwtTokenPairDto> {
        return ResponseEntity.ok(
            oauthService.handleLogin(tokenExchange)
        )
    }
}