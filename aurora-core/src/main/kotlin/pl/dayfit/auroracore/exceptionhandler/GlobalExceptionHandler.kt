package pl.dayfit.auroracore.exceptionhandler

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import pl.dayfit.auroracore.exception.ResourceNotReadyYetException
import java.util.NoSuchElementException

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(e: IllegalArgumentException): ResponseEntity<Map<String, String>> {
        logger.trace("Illegal argument exception: ", e)
        val errorMessage = e.message ?: "Something is wrong with your request"

        return ResponseEntity.badRequest()
            .body(
                mapOf("error" to errorMessage)
            )
    }

    @ExceptionHandler(ResourceNotReadyYetException::class)
    fun handleResumeNotGeneratedYetException(e: ResourceNotReadyYetException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.ACCEPTED)
            .body(
                mapOf("message" to e.message!!)
            )
    }

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(e: NoSuchElementException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(
                mapOf("error" to (e.message ?: "Not found"))
            )
    }

    @ExceptionHandler(java.lang.Exception::class)
    fun handleGenericException(e: Exception): ResponseEntity<Map<String, String>> {
        logger.error("Unhandled exception: ", e)

        return ResponseEntity.internalServerError()
            .body(
                mapOf("error" to "Internal server error")
            )
    }
}