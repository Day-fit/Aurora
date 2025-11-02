package pl.dayfit.auroraauth.event

import com.nimbusds.jose.jwk.OctetKeyPair

data class SecretRotatedEvent(
    val jwk: OctetKeyPair
)