package gr.athenarc.imsi.visualfacts.tool.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import gr.athenarc.imsi.visualfacts.tool.config.ApplicationProperties;
import gr.athenarc.imsi.visualfacts.tool.domain.Dataset;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Repository
public class DataRepositoryImpl implements DatasetRepository {

    private final ApplicationProperties applicationProperties;

    private final Logger log = LoggerFactory.getLogger(DataRepositoryImpl.class);

    public DataRepositoryImpl(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public List<Dataset> findAll() {
        throw new UnsupportedOperationException();
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
        ObjectMapper mapper = new ObjectMapper();
        File metadataFile = new File(applicationProperties.getWorkspacePath(), dataset.getId() + ".meta.json");
        FileWriter writer = new FileWriter(metadataFile);
        mapper.writeValue(writer, Dataset.class);
        return dataset;
    }

    @Override
    public void deleteById(String id) {
        throw new UnsupportedOperationException();
    }
}
