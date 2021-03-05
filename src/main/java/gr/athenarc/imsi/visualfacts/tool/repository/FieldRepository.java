package gr.athenarc.imsi.visualfacts.tool.repository;

import gr.athenarc.imsi.visualfacts.tool.domain.Field;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Field entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FieldRepository extends JpaRepository<Field, Long> {
}
