package pl.dayfit.auroraauth.service

import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.auth.provider.CredentialsAuthProvider
import pl.dayfit.auroraauth.auth.token.CredentialsTokenCandidate
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto

@Service
class AuthService(
    private val jwtGenerationService: JwtGenerationService,
    private val credentialsAuthProvider: CredentialsAuthProvider
) {
    fun handleLogin(loginDto: LoginRequestDto): JwtTokenPairDto {
        val authentication = credentialsAuthProvider.authenticate(
            CredentialsTokenCandidate(
                loginDto.identifier,
                loginDto.password
            )
        )

        val pair = jwtGenerationService.generateTokenPair(authentication.name)
        return JwtTokenPairDto(
            pair.first,
            pair.second
        )
    }
}