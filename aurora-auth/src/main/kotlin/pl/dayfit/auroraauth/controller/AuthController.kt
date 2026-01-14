package pl.dayfit.auroraauth.controller

import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroraauth.configuration.properties.CookiesConfigurationProperties
import pl.dayfit.auroraauth.configuration.properties.JwtConfigurationProperties
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.request.RegisterRequestDto
import pl.dayfit.auroraauth.dto.response.AuthenticationStatusResponseDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
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

    @PostMapping("/login")
    fun login(@RequestBody loginDto: LoginRequestDto): ResponseEntity<Void> {
        val pair = authService.handleLogin(loginDto)

        val accessTokenCookie = ResponseCookie.from("accessToken", pair.accessToken)
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(jwtConfigurationProperties
                .accessTokenValidity
                .inWholeSeconds
            )
            .build()

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
                it.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                it.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            }
            .build()
    }

    @PostMapping("/register")
    fun register(@RequestBody @Valid registerDto: RegisterRequestDto): ResponseEntity<Map<String, String>> {
        authService.handleRegistration(registerDto)
        return ResponseEntity.ok(
            mapOf("message" to "User registered successfully!")
        )
    }

    @PostMapping("/refresh")
    fun refresh(@AuthenticationPrincipal principal: Principal): ResponseEntity<JwtTokenPairDto>
    {
        val pair = authService.handleRefresh(
            UUID.fromString(principal.name)
        )

        val accessTokenCookie = ResponseCookie.from("accessToken", pair.accessToken)
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(jwtConfigurationProperties
                .accessTokenValidity
                .inWholeSeconds
            )
            .build()

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
                it.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                it.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
            }
            .build()
    }

    @PostMapping("/logout")
    fun logout(): ResponseEntity<Void>
    {
        val accessTokenCookie = ResponseCookie.from("accessToken", "")
            .httpOnly(true)
            .secure(cookiesConfigurationProperties.secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(jwtConfigurationProperties
                .accessTokenValidity
                .inWholeSeconds
            )
            .build()

        val refreshTokenCookie = ResponseCookie.from("refreshToken", "")
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
                it.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
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