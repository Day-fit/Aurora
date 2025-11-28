# Aurora Auth
Microservice for handling auth related activity

## Endpoints:
- /api/v1/auth/login - provides a pair of refresh and access token 
- /api/v1/auth/register - handles registering a new user (PROVIDER=LOCAL)
- /api/v1/auth/refresh - provides a new access token based on refresh token
