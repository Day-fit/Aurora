package pl.dayfit.auroraauth.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.request.RegisterRequestDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import pl.dayfit.auroraauth.service.AuthService
import java.security.Principal
import java.util.UUID

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody loginDto: LoginRequestDto): ResponseEntity<JwtTokenPairDto> {
        return ResponseEntity.ok(authService.handleLogin(loginDto))
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

        return ResponseEntity.ok(pair)
    }
}