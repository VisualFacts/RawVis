package gr.athenarc.imsi.visualfacts.tool.web.rest;

import gr.athenarc.imsi.visualfacts.tool.domain.Field;
import gr.athenarc.imsi.visualfacts.tool.repository.FieldRepository;
import gr.athenarc.imsi.visualfacts.tool.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link gr.athenarc.imsi.visualfacts.tool.domain.Field}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FieldResource {

    private final Logger log = LoggerFactory.getLogger(FieldResource.class);

    private static final String ENTITY_NAME = "field";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FieldRepository fieldRepository;

    public FieldResource(FieldRepository fieldRepository) {
        this.fieldRepository = fieldRepository;
    }

    /**
     * {@code POST  /fields} : Create a new field.
     *
     * @param field the field to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new field, or with status {@code 400 (Bad Request)} if the field has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fields")
    public ResponseEntity<Field> createField(@RequestBody Field field) throws URISyntaxException {
        log.debug("REST request to save Field : {}", field);
        if (field.getId() != null) {
            throw new BadRequestAlertException("A new field cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Field result = fieldRepository.save(field);
        return ResponseEntity.created(new URI("/api/fields/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fields} : Updates an existing field.
     *
     * @param field the field to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated field,
     * or with status {@code 400 (Bad Request)} if the field is not valid,
     * or with status {@code 500 (Internal Server Error)} if the field couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fields")
    public ResponseEntity<Field> updateField(@RequestBody Field field) throws URISyntaxException {
        log.debug("REST request to update Field : {}", field);
        if (field.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Field result = fieldRepository.save(field);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, field.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /fields} : get all the fields.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fields in body.
     */
    @GetMapping("/fields")
    public List<Field> getAllFields() {
        log.debug("REST request to get all Fields");
        return fieldRepository.findAll();
    }

    /**
     * {@code GET  /fields/:id} : get the "id" field.
     *
     * @param id the id of the field to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the field, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fields/{id}")
    public ResponseEntity<Field> getField(@PathVariable Long id) {
        log.debug("REST request to get Field : {}", id);
        Optional<Field> field = fieldRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(field);
    }

    /**
     * {@code DELETE  /fields/:id} : delete the "id" field.
     *
     * @param id the id of the field to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fields/{id}")
    public ResponseEntity<Void> deleteField(@PathVariable Long id) {
        log.debug("REST request to delete Field : {}", id);
        fieldRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
