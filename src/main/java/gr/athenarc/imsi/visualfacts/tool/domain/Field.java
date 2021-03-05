package gr.athenarc.imsi.visualfacts.tool.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Field.
 */
@Entity
@Table(name = "field")
public class Field implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "field_index")
    private Integer fieldIndex;

    @ManyToOne
    @JsonIgnoreProperties(value = "dimensions", allowSetters = true)
    private Dataset dataset;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Field name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getFieldIndex() {
        return fieldIndex;
    }

    public Field fieldIndex(Integer fieldIndex) {
        this.fieldIndex = fieldIndex;
        return this;
    }

    public void setFieldIndex(Integer fieldIndex) {
        this.fieldIndex = fieldIndex;
    }

    public Dataset getDataset() {
        return dataset;
    }

    public Field dataset(Dataset dataset) {
        this.dataset = dataset;
        return this;
    }

    public void setDataset(Dataset dataset) {
        this.dataset = dataset;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Field)) {
            return false;
        }
        return id != null && id.equals(((Field) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Field{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", fieldIndex=" + getFieldIndex() +
            "}";
    }
}
