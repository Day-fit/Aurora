package pl.dayfit.auroracore.service

import jakarta.transaction.Transactional
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.font.Standard14Fonts
import org.springframework.stereotype.Service
import pl.dayfit.auroracore.dto.GenerationRequestDto
import pl.dayfit.auroracore.dto.GenerationResponseDto
import pl.dayfit.auroracore.model.Resume
import pl.dayfit.auroracore.repository.ResumeRepository
import java.io.ByteArrayOutputStream
import java.util.UUID
import kotlin.io.encoding.Base64

@Service
class GenerationService(val resumeRepository: ResumeRepository) {
    @Transactional
    fun generateResume(requestDto: GenerationRequestDto, userId: UUID): GenerationResponseDto?
    {
        val resume = Resume(
            null,
            userId,
            requestDto.name,
            requestDto.surname,
            requestDto.age,
            requestDto.experience,
            requestDto.skills,
            requestDto.education,
            Base64.decode(requestDto.photo),
            requestDto.description
        )

        resumeRepository.save(resume)

        ByteArrayOutputStream().use { outputStream ->
            PDDocument().use { document ->
                val page = PDPage(PDRectangle.A4)
                val font = PDType1Font(Standard14Fonts.FontName.HELVETICA)
                document.addPage(page)

                PDPageContentStream(document, page).use { contentStream ->
                    contentStream.beginText()
                    contentStream.setFont(font, 12f)
                    contentStream.newLineAtOffset(100f, 700f)
                    contentStream.showText("Quick test! ${resume.name} ${resume.surname}")
                    contentStream.endText()
                }

                document.save(outputStream)
                return GenerationResponseDto(Base64.encode(outputStream.toByteArray()))
            }
        }
    }
}