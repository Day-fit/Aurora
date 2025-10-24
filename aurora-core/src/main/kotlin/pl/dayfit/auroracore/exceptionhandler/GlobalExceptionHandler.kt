package pl.dayfit.auroracore.exceptionhandler

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException
import pl.dayfit.auroracore.exception.ResumeNotGeneratedYetException

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

    @ExceptionHandler(java.lang.Exception::class)
    fun handleGenericException(e: Exception): ResponseEntity<Map<String, String>> {
        logger.error("Unhandled exception: ", e)

        return ResponseEntity.internalServerError()
            .body(
                mapOf("error" to "Internal server error")
            )
    }

    @ExceptionHandler(ResumeNotGeneratedYetException::class)
    fun handleResumeNotGeneratedYetException(e: ResumeNotGeneratedYetException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.ACCEPTED)
            .body(
                mapOf("message" to e.message!!)
            )
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResourceFoundException(): ResponseEntity<Map<String, String>> = ResponseEntity.notFound()
        .build()
}