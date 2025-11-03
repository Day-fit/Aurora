package pl.dayfit.auroraauth.controller

import com.nimbusds.jose.jwk.JWKSet
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import pl.dayfit.auroraauth.service.cache.JwksCacheService

@RestController
@RequestMapping("/")
class JwksController(private val jwksCacheService: JwksCacheService) {

    @GetMapping("/.well-known/jwks.json")
    fun getJwks(): JWKSet {
        return JWKSet(jwksCacheService.getJwks())
    }
}
