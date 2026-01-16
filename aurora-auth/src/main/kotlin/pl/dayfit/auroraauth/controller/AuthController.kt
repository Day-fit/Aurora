package pl.dayfit.auroraauth.controller

import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroraauth.configuration.properties.CookiesConfigurationProperties
import pl.dayfit.auroraauth.configuration.properties.JwtConfigurationProperties
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.request.RegisterRequestDto
import pl.dayfit.auroraauth.dto.response.AccessTokenResponseDto
import pl.dayfit.auroraauth.dto.response.AuthenticationStatusResponseDto
import pl.dayfit.auroraauth.service.AuthService
import pl.dayfit.auroraauth.type.AuthenticationStatus
import java.security.Principal
import java.util.UUID

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService,
    private val jwtConfigurationProperties: JwtConfigurationProperties,
    private val cookiesConfigurationProperties: CookiesConfigurationProperties
) {
    companion object {
        private const val COOKIE_EXPIRE_NOW = 0L
    }

    @PostMapping("/login")
    fun login(@RequestBody loginDto: LoginRequestDto): ResponseEntity<AccessTokenResponseDto> {
        val pair = authService.handleLogin(loginDto)

        val refreshTokenCookie = ResponseCookie.from("refreshToken", pair.refreshToken)
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(jwtConfigurationProperties
                .refreshTokenValidity
                .inWholeSeconds
            )
            .build()

        return ResponseEntity.ok()
            .headers {
                it.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                it.add(HttpHeaders.AUTHORIZATION, "Bearer ${pair.accessToken}")
            }
            .body(AccessTokenResponseDto(pair.accessToken))
    }

    @PostMapping("/register")
    fun register(@RequestBody @Valid registerDto: RegisterRequestDto): ResponseEntity<Map<String, String>> {
        authService.handleRegistration(registerDto)
        return ResponseEntity.ok(
            mapOf("message" to "User registered successfully!")
        )
    }

    @PostMapping("/refresh")
    fun refresh(@CookieValue(name = "refreshToken") refreshToken: String): ResponseEntity<AccessTokenResponseDto>
    {
        val pair = authService.handleRefresh(
            refreshToken
        )

        val refreshTokenCookie = ResponseCookie.from("refreshToken", pair.refreshToken)
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(jwtConfigurationProperties
                .refreshTokenValidity
                .inWholeSeconds
            )
            .build()

        return ResponseEntity.ok()
            .headers {
                it.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                it.add(HttpHeaders.AUTHORIZATION, "Bearer ${pair.accessToken}")
            }
            .body(AccessTokenResponseDto(pair.accessToken))
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<Void>
    {
        val refreshTokenCookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(COOKIE_EXPIRE_NOW)
            .build()

        return ResponseEntity.ok()
            .headers {
                it.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            }
            .build()
    }

    @GetMapping("/status")
    fun status(@AuthenticationPrincipal principal: Principal?): ResponseEntity<AuthenticationStatusResponseDto>
    {
        val isAuthenticated = principal != null

        return ResponseEntity.ok(
        AuthenticationStatusResponseDto(
            principal?.name?.let { UUID.fromString(it) },
            if (isAuthenticated) AuthenticationStatus.LOGGED_IN
            else AuthenticationStatus.LOGGED_OUT
        ))
    }
}
