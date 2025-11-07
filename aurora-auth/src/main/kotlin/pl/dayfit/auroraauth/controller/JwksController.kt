package pl.dayfit.auroraauth.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import pl.dayfit.auroraauth.service.cache.JwksCacheService

@RestController
@RequestMapping("/")
class JwksController(private val jwksCacheService: JwksCacheService) {

    @GetMapping("/.well-known/jwks.json")
    fun getJwks(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            jwksCacheService.getJwks()
            .toJSONObject()
        )
    }
}
