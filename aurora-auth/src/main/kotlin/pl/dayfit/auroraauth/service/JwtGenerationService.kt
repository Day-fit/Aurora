package pl.dayfit.auroraauth.service

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.crypto.Ed25519Signer
import com.nimbusds.jose.jwk.OctetKeyPair
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import pl.dayfit.auroraauth.configuration.properties.JwtConfigurationProperties
import pl.dayfit.auroraauth.event.SecretRotatedEvent
import pl.dayfit.auroraauth.type.TokenType
import java.util.Date
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

@Service
class JwtGenerationService(private val jwtConfigurationProperties: JwtConfigurationProperties) {
    private var secretKey: AtomicReference<OctetKeyPair> = AtomicReference()

    /**
     * Generates a pair of JWT tokens, specifically an access token and a refresh token,
     * both associated with the provided subject.
     *
     * @param subject the uuid of subject for which the tokens will be generated
     * @return a pair of tokens where the first element is the access token and the second element is the refresh token
     */
    fun generateTokenPair(subject: UUID): Pair<String, String>
    {
        val accessToken = generate(TokenType.ACCESS, subject)
        val refreshToken = generate(TokenType.REFRESH, subject)

        return Pair(accessToken, refreshToken)
    }

    private fun generate(tokenType: TokenType, subject: UUID): String
    {
        val signer = Ed25519Signer(
            secretKey.get()
        )

        val claimSet = JWTClaimsSet.Builder()
            .subject(subject.toString())
            .expirationTime(
                if (tokenType == TokenType.ACCESS) Date(System.currentTimeMillis() + jwtConfigurationProperties.accessTokenValidity.inWholeMilliseconds)
                else Date(System.currentTimeMillis() + jwtConfigurationProperties.refreshTokenValidity.inWholeMilliseconds)
            )
            .claim("type", tokenType.name)
            .build()


        val signedJwt = SignedJWT(
            JWSHeader.Builder(JWSAlgorithm.EdDSA)
                .keyID(secretKey.get().keyID)
                .build(),

            claimSet
        )

        signedJwt.sign(signer)
        return signedJwt.serialize()
    }

    @EventListener
    private fun setSecretKey(event: SecretRotatedEvent)
    {
        val jwk = event.jwk

        if (!jwk.isPrivate)
        {
            throw IllegalArgumentException("Private key is required")
        }

        this.secretKey.set(jwk)
    }
}