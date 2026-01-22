package pl.dayfit.auroracore.configuration

import org.springframework.cache.CacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.cache.RedisCacheManager
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories

@Configuration
@EnableRedisRepositories(basePackages = ["pl.dayfit.auroracore.repository.redis"])
class RedisConfiguration {
    @Bean
    fun cacheManager(
        redisConnectionFactory: RedisConnectionFactory
    ): CacheManager = RedisCacheManager.create(redisConnectionFactory)

    @Bean
    fun redisTemplate(): RedisTemplate<String, Any> = RedisTemplate()
}