package gr.athenarc.imsi.visualfacts.tool.repository;

import gr.athenarc.imsi.visualfacts.tool.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
