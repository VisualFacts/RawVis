package gr.athenarc.imsi.visualfacts.tool.repository;

import gr.athenarc.imsi.visualfacts.tool.domain.Dataset;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Repository for the Dataset entity.
 */
@SuppressWarnings("unused")
public interface DatasetRepository {

    List<Dataset> findAll() throws IOException;

    Optional<Dataset> findById(String id) throws IOException;

    Dataset save(Dataset dataset) throws IOException;

    void deleteById(String id);


}
