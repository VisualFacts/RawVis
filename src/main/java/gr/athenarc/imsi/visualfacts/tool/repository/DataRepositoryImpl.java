package gr.athenarc.imsi.visualfacts.tool.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import gr.athenarc.imsi.visualfacts.tool.config.ApplicationProperties;
import gr.athenarc.imsi.visualfacts.tool.domain.Dataset;
import gr.athenarc.imsi.visualfacts.tool.web.rest.errors.StorageException;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

@Repository
public class DataRepositoryImpl implements DatasetRepository {
  private final ApplicationProperties applicationProperties;

  private final Logger log = LoggerFactory.getLogger(DataRepositoryImpl.class);

  public DataRepositoryImpl(ApplicationProperties applicationProperties) {
    this.applicationProperties = applicationProperties;
  }

  @Override
  public List<Dataset> findAll() throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    List<Dataset> datasets = new ArrayList<>();
    List<File> metadataFiles = Files
      .list(Paths.get(applicationProperties.getWorkspacePath()))
      .filter(path -> path.toString().endsWith(".meta.json"))
      .map(Path::toFile)
      .collect(Collectors.toList());
    for (File metadataFile : metadataFiles) {
      FileReader reader = new FileReader(metadataFile);
      datasets.add(mapper.readValue(reader, Dataset.class));
    }
    return datasets;
  }

  @Override
  public String findFile(String id) throws IOException {
    BufferedReader reader;
    String filedata = "";
    try {
      reader = new BufferedReader(new FileReader(Paths.get(applicationProperties.getWorkspacePath() + "/" + id).toString()));
      String line = reader.readLine();
      Integer i = 0;
      while (i != 50) {
        System.out.println(line);
        if (i == 0) {
          filedata = line;
        } else {
          filedata = filedata + "\n" + line;
        }
        line = reader.readLine();
        i++;
      }
      reader.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return filedata;
  }

  @Override
  public Optional<Dataset> findById(String id) throws IOException {
    Assert.notNull(id, "Id must not be null!");
    ObjectMapper mapper = new ObjectMapper();

    Dataset dataset = null;
    File metadataFile = new File(applicationProperties.getWorkspacePath(), id + ".meta.json");

    if (metadataFile.exists()) {
      FileReader reader = new FileReader(metadataFile);
      dataset = mapper.readValue(reader, Dataset.class);
    }
    return Optional.ofNullable(dataset);
  }

  @Override
  public Dataset save(Dataset dataset) throws IOException {
    Assert.notNull(dataset, "Dataset must not be null!");
    dataset.setId(dataset.getName().substring(0, dataset.getName().indexOf(".")));
    ObjectMapper mapper = new ObjectMapper();
    File metadataFile = new File(applicationProperties.getWorkspacePath(), dataset.getId() + ".meta.json");
    FileWriter writer = new FileWriter(metadataFile);
    mapper.writeValue(writer, dataset);
    System.out.println();
    return dataset;
  }

  @Override
  public void saveFile(MultipartFile file) {
    Path rootLocation = Paths.get(applicationProperties.getWorkspacePath());
    File f = new File(rootLocation.toString() + '/' + file.getOriginalFilename());
    if (f.exists() == false) {
      try {
        if (file.isEmpty()) {
          throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
        }
        Files.copy(file.getInputStream(), rootLocation.resolve(file.getOriginalFilename()));
      } catch (IOException e) {
        throw new StorageException("Failed to store file " + file.getOriginalFilename(), e);
      }
    }
  }

  @Override
  public String deleteById(String id) {
    Path rootLocation = Paths.get(applicationProperties.getWorkspacePath());
    File originalFile = new File(rootLocation.toString() + '/' + id);
    File metaFile = new File(rootLocation.toString() + '/' + id.substring(0, id.indexOf(".")) + ".meta.json");
    if (originalFile.delete() && metaFile.delete()) {
      return "File Deletion Successful.";
    } else {
      return "Failed to delete the file.";
    }
  }
}
