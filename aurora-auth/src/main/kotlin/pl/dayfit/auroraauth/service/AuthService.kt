package pl.dayfit.auroraauth.service

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.auth.provider.CredentialsAuthProvider
import pl.dayfit.auroraauth.auth.token.CredentialsToken
import pl.dayfit.auroraauth.auth.token.CredentialsTokenCandidate
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.request.RegisterRequestDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import pl.dayfit.auroraauth.event.UserReadyForInitializingEvent
import pl.dayfit.auroraauth.exception.UserAlreadyExistsException
import pl.dayfit.auroraauth.model.AuroraUser
import pl.dayfit.auroraauth.oauth.OAuthUserInfo
import pl.dayfit.auroraauth.repository.UserRepository
import pl.dayfit.auroraauthlib.service.JwtClaimsService
import pl.dayfit.auroraauthlib.type.RoleType
import java.util.UUID

@Service
class AuthService(
    private val jwtGenerationService: JwtGenerationService,
    private val credentialsAuthProvider: CredentialsAuthProvider,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val rabbitTemplate: RabbitTemplate,
    private val jwtClaimsService: JwtClaimsService
) {
    fun handleLogin(loginDto: LoginRequestDto): JwtTokenPairDto {
        val authentication = credentialsAuthProvider.authenticate(
            CredentialsTokenCandidate(
                loginDto.identifier,
                loginDto.password!!
            )
        ) as CredentialsToken

        val pair = jwtGenerationService.generateTokenPair(authentication.getId())
        return JwtTokenPairDto(
            pair.first,
            pair.second
        )
    }

    fun handleRegistration(registerDto: RegisterRequestDto) {
        val result = userRepository.findByUsernameOrEmail(registerDto.username, registerDto.email)
        if (result.isPresent){
            throw UserAlreadyExistsException("User with given username or email already exists")
        }

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

        rabbitTemplate.convertAndSend(
            "user.init.exchange",
            "",
            UserReadyForInitializingEvent(
            user.id!!
                .toString()
        ))
    }

    fun handleRefresh(refreshToken: String): JwtTokenPairDto
    {
        jwtClaimsService.validate(refreshToken)
        val sub = jwtClaimsService.getSubject(refreshToken)
        val pair = jwtGenerationService.generateTokenPair(sub)
        return JwtTokenPairDto(
            pair.first,
            pair.second
        )
    }

    fun handleRegistration(info: OAuthUserInfo): UUID
    {
        val user = AuroraUser(
            null,
            info.username,
            info.email,
            null,
            mutableListOf(RoleType.STANDARD),
            banned = false,
            enabled = true, //TODO: Change to false when email verification is implemented
            info.provider
        )

        return userRepository
            .save(user)
            .id!!
    }
}