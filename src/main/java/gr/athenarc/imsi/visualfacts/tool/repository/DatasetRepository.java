package gr.athenarc.imsi.visualfacts.tool.repository;

import gr.athenarc.imsi.visualfacts.tool.domain.Dataset;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import org.springframework.web.multipart.MultipartFile;

/**
 * Repository for the Dataset entity.
 */
@SuppressWarnings("unused")
public interface DatasetRepository {
  List<Dataset> findAll() throws IOException;

  String findFile(String id) throws IOException;

  Optional<Dataset> findById(String id) throws IOException;

  Dataset save(Dataset dataset) throws IOException;

  void saveFile(MultipartFile dataFile);

  String deleteById(String id);
}
