package pl.dayfit.auroraauth.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.dayfit.auroraauth.dto.request.LoginRequestDto
import pl.dayfit.auroraauth.dto.response.JwtTokenPairDto
import pl.dayfit.auroraauth.service.AuthService

@RestController
@RequestMapping("/auth")
class AuthController(val authService: AuthService) {

    @PostMapping("/login")
    fun login(@RequestBody loginDto: LoginRequestDto): ResponseEntity<JwtTokenPairDto> {
        return ResponseEntity.ok(authService.handleLogin(loginDto))
    }
}