package pl.dayfit.auroraai

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync

@EnableAsync
@SpringBootApplication
class AuroraAiApplication

fun main(args: Array<String>) {
    runApplication<AuroraAiApplication>(*args)
}
