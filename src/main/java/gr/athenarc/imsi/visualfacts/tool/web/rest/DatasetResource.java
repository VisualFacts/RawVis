package gr.athenarc.imsi.visualfacts.tool.web.rest;

import gr.athenarc.imsi.visualfacts.tool.domain.Dataset;
import gr.athenarc.imsi.visualfacts.tool.domain.VisQuery;
import gr.athenarc.imsi.visualfacts.tool.domain.VisQueryResults;
import gr.athenarc.imsi.visualfacts.tool.repository.DatasetRepository;
import gr.athenarc.imsi.visualfacts.tool.service.RawDataService;
import gr.athenarc.imsi.visualfacts.tool.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link gr.athenarc.imsi.visualfacts.tool.domain.Dataset}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DatasetResource {

    private static final String ENTITY_NAME = "dataset";
    private final Logger log = LoggerFactory.getLogger(DatasetResource.class);
    private final DatasetRepository datasetRepository;
    private final RawDataService rawDataService;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public DatasetResource(DatasetRepository datasetRepository, RawDataService rawDataService) {
        this.datasetRepository = datasetRepository;
        this.rawDataService = rawDataService;
    }

    /**
     * {@code POST  /datasets} : Create a new dataset.
     *
     * @param dataset the dataset to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dataset, or with status {@code 400 (Bad Request)} if the dataset has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/datasets")
    public ResponseEntity<Dataset> createDataset(@Valid @RequestBody Dataset dataset) throws URISyntaxException {
        log.debug("REST request to save Dataset : {}", dataset);
        if (dataset.getId() != null) {
            throw new BadRequestAlertException("A new dataset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Dataset result = datasetRepository.save(dataset);
        return ResponseEntity.created(new URI("/api/datasets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /datasets} : Updates an existing dataset.
     *
     * @param dataset the dataset to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataset,
     * or with status {@code 400 (Bad Request)} if the dataset is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dataset couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/datasets")
    public ResponseEntity<Dataset> updateDataset(@Valid @RequestBody Dataset dataset) throws URISyntaxException {
        log.debug("REST request to update Dataset : {}", dataset);
        if (dataset.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Dataset result = datasetRepository.save(dataset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dataset.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /datasets} : get all the datasets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of datasets in body.
     */
    @GetMapping("/datasets")
    public List<Dataset> getAllDatasets() {
        log.debug("REST request to get all Datasets");
        return datasetRepository.findAll();
    }

    /**
     * {@code GET  /datasets/:id} : get the "id" dataset.
     *
     * @param id the id of the dataset to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dataset, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/datasets/{id}")
    public ResponseEntity<Dataset> getDataset(@PathVariable Long id) {
        log.debug("REST request to get Dataset : {}", id);
        Optional<Dataset> dataset = datasetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dataset);
    }

    /**
     * {@code DELETE  /datasets/:id} : delete the "id" dataset.
     *
     * @param id the id of the dataset to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/datasets/{id}")
    public ResponseEntity<Void> deleteDataset(@PathVariable Long id) {
        log.debug("REST request to delete Dataset : {}", id);
        datasetRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * POST executeQuery
     */
    @PostMapping("/datasets/{id}/query")
    public ResponseEntity<VisQueryResults> executeQuery(@PathVariable Long id, @Valid @RequestBody VisQuery query) {
        log.debug("REST request to execute Query: {}", query);
        Optional<VisQueryResults> queryResultsOptional = datasetRepository.findById(id).map(dataset -> rawDataService.executeQuery(dataset, query));
        return ResponseUtil.wrapOrNotFound(queryResultsOptional);
    }

    @PostMapping(path = "/datasets/{id}/reset-index")
    public void resetIndex(@PathVariable Long id) {
        log.debug("REST request to reset index for dataset: {}", id);
        datasetRepository.findById(id).ifPresent(dataset -> rawDataService.removeIndex(dataset));
    }

    @GetMapping("/datasets/{id}/status")
    public IndexStatus getIndexStatus(@PathVariable Long id) {
        return new IndexStatus(rawDataService.isIndexInitialized(id), rawDataService.getObjectsIndexed(id));
    }
}

class IndexStatus {
    boolean isInitialized = false;
    int objectsIndexed = 0;

    public IndexStatus(boolean isInitialized, int objectsIndexed) {
        this.isInitialized = isInitialized;
        this.objectsIndexed = objectsIndexed;
    }

    public boolean getIsInitialized() {
        return isInitialized;
    }

    public void setInitialized(boolean initialized) {
        isInitialized = initialized;
    }

    public int getObjectsIndexed() {
        return objectsIndexed;
    }

    public void setObjectsIndexed(int objectsIndexed) {
        this.objectsIndexed = objectsIndexed;
    }
}
