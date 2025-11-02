package pl.dayfit.auroraauth.dto.response

data class JwtTokenPairDto (
    val accessToken: String,
    val refreshToken: String
)