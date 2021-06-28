package gr.athenarc.imsi.visualfacts.tool.domain;


import gr.athenarc.imsi.visualfacts.tool.domain.enumeration.DatasetType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Dataset.
 */
@Entity
@Table(name = "dataset")
public class Dataset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private DatasetType type;

    @NotNull
    @Column(name = "object_count", nullable = false)
    private Integer objectCount;

    @NotNull
    @Column(name = "x_min", nullable = false)
    private Float xMin;

    @NotNull
    @Column(name = "x_max", nullable = false)
    private Float xMax;

    @NotNull
    @Column(name = "y_min", nullable = false)
    private Float yMin;

    @NotNull
    @Column(name = "y_max", nullable = false)
    private Float yMax;

    @NotNull
    @Column(name = "query_x_min", nullable = false)
    private Float queryXMin;

    @NotNull
    @Column(name = "query_x_max", nullable = false)
    private Float queryXMax;

    @NotNull
    @Column(name = "query_y_min", nullable = false)
    private Float queryYMin;

    @NotNull
    @Column(name = "query_y_max", nullable = false)
    private Float queryYMax;

    @OneToOne
    @JoinColumn(unique = true)
    private Field measure0;

    @OneToOne
    @JoinColumn(unique = true)
    private Field measure1;

    @OneToOne
    @JoinColumn(unique = true)
    private Field lat;

    @OneToOne
    @JoinColumn(unique = true)
    private Field lon;

    @OneToMany(mappedBy = "dataset", fetch = FetchType.EAGER)
    private Set<Field> dimensions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Dataset name(String name) {
        this.name = name;
        return this;
    }

    public DatasetType getType() {
        return type;
    }

    public void setType(DatasetType type) {
        this.type = type;
    }

    public Dataset type(DatasetType type) {
        this.type = type;
        return this;
    }

    public Integer getObjectCount() {
        return objectCount;
    }

    public void setObjectCount(Integer objectCount) {
        this.objectCount = objectCount;
    }

    public Float getxMin() {
        return xMin;
    }

    public void setxMin(Float xMin) {
        this.xMin = xMin;
    }

    public Float getxMax() {
        return xMax;
    }

    public void setxMax(Float xMax) {
        this.xMax = xMax;
    }

    public Float getyMin() {
        return yMin;
    }

    public void setyMin(Float yMin) {
        this.yMin = yMin;
    }

    public Float getyMax() {
        return yMax;
    }

    public void setyMax(Float yMax) {
        this.yMax = yMax;
    }

    public Float getQueryXMin() {
        return queryXMin;
    }

    public void setQueryXMin(Float queryXMin) {
        this.queryXMin = queryXMin;
    }

    public Float getQueryXMax() {
        return queryXMax;
    }

    public void setQueryXMax(Float queryXMax) {
        this.queryXMax = queryXMax;
    }

    public Float getQueryYMin() {
        return queryYMin;
    }

    public void setQueryYMin(Float queryYMin) {
        this.queryYMin = queryYMin;
    }

    public Float getQueryYMax() {
        return queryYMax;
    }

    public void setQueryYMax(Float queryYMax) {
        this.queryYMax = queryYMax;
    }

    public Field getMeasure0() {
        return measure0;
    }

    public void setMeasure0(Field measure0) {
        this.measure0 = measure0;
    }

    public Field getMeasure1() {
        return measure1;
    }

    public void setMeasure1(Field measure1) {
        this.measure1 = measure1;
    }

    public Field getLat() {
        return lat;
    }

    public void setLat(Field field) {
        this.lat = field;
    }

    public Dataset lat(Field field) {
        this.lat = field;
        return this;
    }

    public Field getLon() {
        return lon;
    }

    public void setLon(Field field) {
        this.lon = field;
    }

    public Dataset lon(Field field) {
        this.lon = field;
        return this;
    }

    public Set<Field> getDimensions() {
        return dimensions;
    }

    public void setDimensions(Set<Field> fields) {
        this.dimensions = fields;
    }

    public Dataset dimensions(Set<Field> fields) {
        this.dimensions = fields;
        return this;
    }

    public Dataset addDimensions(Field field) {
        this.dimensions.add(field);
        field.setDataset(this);
        return this;
    }

    public Dataset removeDimensions(Field field) {
        this.dimensions.remove(field);
        field.setDataset(null);
        return this;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Dataset)) {
            return false;
        }
        return id != null && id.equals(((Dataset) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Dataset{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
