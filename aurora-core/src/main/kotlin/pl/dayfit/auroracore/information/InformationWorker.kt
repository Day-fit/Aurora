package pl.dayfit.auroracore.information

import pl.dayfit.auroracore.dto.InformationDto
import pl.dayfit.auroracore.type.AutoGenerationSource

interface InformationWorker {
    fun processInformation(name: String): InformationDto
    fun supports(source: AutoGenerationSource): Boolean
}