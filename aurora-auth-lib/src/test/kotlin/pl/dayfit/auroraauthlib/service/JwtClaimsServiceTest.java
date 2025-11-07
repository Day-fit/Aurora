package pl.dayfit.auroraauthlib.service;

import com.nimbusds.jose.JWSAlgorithm;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;

public class JwtClaimsServiceTest {
    private Logger logger = org.slf4j.LoggerFactory.getLogger(JwtClaimsServiceTest.class);
    private final JwtClaimsService jwtClaimsService = new JwtClaimsService();
    private final String jwtToken = "eyJhbGciOiJub25lIiwia2lkIjoxLCJzdWJqZWN0IjoiN2VhYTNhOGYtNjI5Mi00OTVhLThlZjQtNDEyYWUwOTUyNWM2In0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0.";

    @Test
    public void testGetRoles()
    {
        jwtClaimsService.getRoles(jwtToken)
                .forEach(role -> logger.info("Role: {}", role));
    }
}
