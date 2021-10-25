package gr.athenarc.imsi.visualfacts.tool.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;

@Configuration
public class InitialDataMigration {

    private final Logger log = LoggerFactory.getLogger(InitialDataMigration.class);
    private final ApplicationProperties applicationProperties;

    public InitialDataMigration(ApplicationProperties applicationProperties) throws IOException {
        this.applicationProperties = applicationProperties;
        String initialDataPath = getClass().getClassLoader().getResource("initial-data").getPath();

        File workspaceDirectory = new File(applicationProperties.getWorkspacePath());
        if (!workspaceDirectory.exists()) {
            workspaceDirectory.mkdir();
        }
        log.debug(workspaceDirectory.toPath().toString());
        for (File file : new File(initialDataPath).listFiles()) {
            log.debug("Copying metadata file " + file.getName() + " to workspace directory.");
            try {
                Files.copy(file.toPath(), workspaceDirectory.toPath().resolve(file.getName()));
            } catch (FileAlreadyExistsException e) {
                log.debug("Metadata file " + file.getName() + " already exists in workspace directory.");
            }
        }
    }
}
