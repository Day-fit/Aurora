package pl.dayfit.auroraauth.service

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.auth.provider.CredentialsAuthProvider
import pl.dayfit.auroraauth.auth.token.CredentialsTokenCandidate
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.request.RegisterRequestDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import pl.dayfit.auroraauth.model.AuroraUser
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauth.type.AuthProvider
import pl.dayfit.auroraauthlib.type.RoleType

@Service
class AuthService(
    private val jwtGenerationService: JwtGenerationService,
    private val credentialsAuthProvider: CredentialsAuthProvider,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    fun handleLogin(loginDto: LoginRequestDto): JwtTokenPairDto {
        if (loginDto.provider != AuthProvider.LOCAL)
        {
            throw IllegalArgumentException("Only local provider is supported for now")
        }

        val authentication = credentialsAuthProvider.authenticate(
            CredentialsTokenCandidate(
                loginDto.identifier,
                loginDto.password!!
            )
        )

        val pair = jwtGenerationService.generateTokenPair(authentication.name)
        return JwtTokenPairDto(
            pair.first,
            pair.second
        )
    }

    fun handleRegistration(registerDto: RegisterRequestDto) {
        val user = AuroraUser(
            null,
            registerDto.username,
            registerDto.email,
            passwordEncoder.encode(registerDto.password),
            mutableListOf(RoleType.STANDARD),
            banned = false,
            enabled = true, //TODO: Change to false when email verification is implemented
             registerDto.provider
        )

        userRepository.save(user)
    }
}