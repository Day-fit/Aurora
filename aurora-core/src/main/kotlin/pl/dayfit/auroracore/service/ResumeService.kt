package pl.dayfit.auroracore.service

import org.springframework.stereotype.Service
import pl.dayfit.auroracore.exception.ResumeNotGeneratedYetException
import pl.dayfit.auroracore.repository.ResumeRepository
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class ResumeService (
    private val resumeRepository: ResumeRepository
) {
    fun getResume(id: UUID): String {
        val resume = resumeRepository.findById(id)
            .orElseThrow{ NoSuchElementException("There is no resume with such a id") }

        val result = resume.generatedResult
            ?: throw ResumeNotGeneratedYetException("Resume has not been generated yet")

        return Base64.encode(result)
    }
}