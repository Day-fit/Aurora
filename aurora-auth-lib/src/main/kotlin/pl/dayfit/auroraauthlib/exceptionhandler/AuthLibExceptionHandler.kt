package pl.dayfit.auroraauthlib.exceptionhandler

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class AuthLibExceptionHandler {
    val logger = org.slf4j.LoggerFactory.getLogger(AuthLibExceptionHandler::class.java)

    @ExceptionHandler(BadCredentialsException::class)
    fun handleBadCredentialsException(e: BadCredentialsException): ResponseEntity<Map<String, String>> {
        logger.trace("Bad credentials exception: ", e)
        val errorMessage = e.message ?: "Bad credentials"

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(
                mapOf("error" to errorMessage)
            )
    }
}