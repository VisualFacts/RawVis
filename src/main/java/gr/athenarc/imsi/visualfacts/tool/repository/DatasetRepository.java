package gr.athenarc.imsi.visualfacts.tool.repository;

import gr.athenarc.imsi.visualfacts.tool.domain.Dataset;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Dataset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DatasetRepository extends JpaRepository<Dataset, String> {
}
