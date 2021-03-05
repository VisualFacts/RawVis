package gr.athenarc.imsi.visualfacts.tool.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Vf Tool.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    String dataPath;

    public String getDataPath() {
        return dataPath;
    }

    public void setDataPath(String dataPath) {
        this.dataPath = dataPath;
    }
}
