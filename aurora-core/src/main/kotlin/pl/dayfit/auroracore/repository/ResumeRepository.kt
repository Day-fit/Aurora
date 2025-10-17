package pl.dayfit.auroracore.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import pl.dayfit.auroracore.model.Resume
import java.util.UUID

@Repository
interface ResumeRepository : JpaRepository<Resume, UUID>