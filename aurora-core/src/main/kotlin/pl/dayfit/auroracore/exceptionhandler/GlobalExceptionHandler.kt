package pl.dayfit.auroracore.exceptionhandler

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException
import pl.dayfit.auroracore.exception.TrackerFailedException
import pl.dayfit.auroracore.exception.InvalidBase64Exception
import pl.dayfit.auroracore.exception.ResourceNotReadyYetException
import pl.dayfit.auroracore.exception.UuidInvalidException
import java.security.NoSuchProviderException
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
    fun handleResourceNotReadyYetException(e: ResourceNotReadyYetException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.ACCEPTED)
            .body(
                mapOf("message" to (e.message?: "Resource is not ready yet. Please try again later."))
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

    @ExceptionHandler(TrackerFailedException::class)
    fun handleAutoGenerationFailedException(e: TrackerFailedException): ResponseEntity<Map<String, String>> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(
                mapOf("error" to (e.message ?: "Auto generation failed"))
            )
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleJsonParseException(): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(
                mapOf("error" to "Request body is not valid JSON syntax")
            )
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, String?>> {

        val errors = ex.bindingResult?.fieldErrors?.associate { fieldError ->
            fieldError.field to fieldError.defaultMessage
        }

        if (errors == null)
        {
            return ResponseEntity
                .badRequest()
                .body(
                    mapOf("error" to "Validation failed, something is wrong with your request")
                )
        }

        return ResponseEntity
            .badRequest()
            .body(errors)
    }

    @ExceptionHandler(NoSuchProviderException::class)
    fun handleNoSuchProviderException(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(mapOf("error" to "Given provider is not supported"))
    }

    @ExceptionHandler(UuidInvalidException::class)
    fun handleUuidInvalidException(e: UuidInvalidException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(mapOf("error" to (e.message ?: "Invalid UUID")))
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResourceFoundException(e: NoResourceFoundException): ResponseEntity<Map<String, String>> {
        logger.trace("Requested resource not found: ", e)
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(mapOf("error" to (e.message ?: "Requested resource not found")))
    }

    @ExceptionHandler(InvalidBase64Exception::class)
    fun handleInvalidBase64Exception(e: InvalidBase64Exception): ResponseEntity<Map<String, String>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(mapOf("error" to (e.message ?: "Invalid base64 string")))
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<Map<String, String>>
    {
        logger.error("Unhandled exception has been thrown: ", ex)

        return ResponseEntity
            .internalServerError()
            .body(mapOf("error" to "Internal server error"))
    }
}