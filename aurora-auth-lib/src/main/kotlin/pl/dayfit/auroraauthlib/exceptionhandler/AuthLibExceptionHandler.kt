package pl.dayfit.auroraauthlib.exceptionhandler

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authorization.AuthorizationDeniedException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class AuthLibExceptionHandler {
    private val logger = org.slf4j.LoggerFactory.getLogger(AuthLibExceptionHandler::class.java)

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(ex: AccessDeniedException): ResponseEntity<Map<String, String>> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(mapOf("error" to (ex.message ?: "Access Denied")))
    }

    @ExceptionHandler(AuthorizationDeniedException::class)
    fun handleAuthorizationDeniedException(ex: AuthorizationDeniedException): ResponseEntity<Map<String, String>> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(mapOf("error" to (ex.message ?: "Access Denied")))
    }

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