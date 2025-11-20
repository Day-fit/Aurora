package pl.dayfit.auroraauth.exception.handler

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, String?>> {

        val errors = ex.bindingResult.fieldErrors.associate { fieldError ->
            fieldError.field to fieldError.defaultMessage
        }

        return ResponseEntity
            .badRequest()
            .body(errors)
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .internalServerError()
            .body(mapOf("error" to "Internal server error"))
    }
}