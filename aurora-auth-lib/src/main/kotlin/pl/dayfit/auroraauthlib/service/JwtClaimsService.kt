package pl.dayfit.auroraauthlib.service

import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.crypto.Ed25519Verifier
import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Service
import java.text.ParseException
import java.util.Objects
import java.util.UUID
import java.util.function.Function
import java.util.function.Supplier

@Service
class JwtClaimsService {
    lateinit var jwksSupplier: Supplier<JWKSet>

    fun getRoles(token: String): Collection<GrantedAuthority> {
        return extractClaim(token) {set ->
            val roles = set.getClaim("roles") as? List<Any?> ?: emptyList<GrantedAuthority>()
            roles
                .map { role -> Objects.toString(role)}
                .map { role -> SimpleGrantedAuthority(role) }
                .toList()
        }
    }

    fun getSubject(token: String): UUID {
        return extractClaim(token) { set -> UUID.fromString(set.subject) }
    }

    private fun <T> extractClaim(token: String, solver: Function<JWTClaimsSet, T>): T
    {
        try {
            val jwt: SignedJWT = SignedJWT.parse(token)
            val set: JWKSet = jwksSupplier.get()
            val header: JWSHeader = jwt.header

            val publicKey = set.getKeyByKeyId(header.keyID).toOctetKeyPair()
            val verifier = Ed25519Verifier(publicKey)

            if (!jwt.verify(verifier))
            {
                throw BadCredentialsException("Invalid signature")
            }

            return solver.apply(jwt.jwtClaimsSet)
        } catch (parseException: ParseException) {
            throw BadCredentialsException("Invalid token", parseException)
        } catch (joseException: JOSEException) {
            throw IllegalStateException("Could not verify token", joseException)
        }
    }
}