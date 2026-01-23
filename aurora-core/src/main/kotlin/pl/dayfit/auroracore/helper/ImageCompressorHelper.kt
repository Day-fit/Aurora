package pl.dayfit.auroracore.helper

import net.coobird.thumbnailator.Thumbnails
import org.springframework.stereotype.Component
import pl.dayfit.auroracore.exception.InvalidBase64Exception
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.InputStream

@Component
class ImageCompressorHelper {
    private val imageQuality = 0.75
    private val profileImageSize = 600

     fun compressProfileImage(fileStream: InputStream): ByteArray {
         try {
             val outputStream = ByteArrayOutputStream()
             Thumbnails.of(fileStream)
                 .outputQuality(imageQuality)
                 .size(profileImageSize, profileImageSize)
                 .keepAspectRatio(true)
                 .toOutputStream(outputStream)

             return outputStream.toByteArray()
         } catch (_: IllegalArgumentException) {
             throw InvalidBase64Exception("Profile image is invalid base64 string")
         }
     }

    fun compressPreview(image: BufferedImage): ByteArray
    {
        ByteArrayOutputStream().use { tmpOutput ->
            Thumbnails.of(image)
                .size(595, 842)
                .outputQuality(imageQuality)
                .outputFormat("png")
                .toOutputStream(tmpOutput)

            return tmpOutput.toByteArray()
        }
    }
}