package pl.dayfit.auroracore.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories

@Configuration
@EnableRedisRepositories(basePackages = ["pl.dayfit.auroracore.repository.redis"])
class RedisConfiguration