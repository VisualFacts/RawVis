package gr.athenarc.imsi.visualfacts.tool.domain;


import gr.athenarc.imsi.visualfacts.tool.domain.enumeration.DatasetType;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Dataset.
 */
public class Dataset implements Serializable {

    private static final long serialVersionUID = 1L;


    private String id;

    @NotNull
    private String name;

    private DatasetType type;

    @Column(name = "has_header", nullable = false)
    private Boolean hasHeader;

    @NotNull
    private Integer objectCount;

    @NotNull
    private Float xMin;

    @NotNull
    private Float xMax;

    @NotNull
    private Float yMin;

    @NotNull
    private Float yMax;

    @NotNull
    private Float queryXMin;

    @NotNull
    private Float queryXMax;

    @NotNull
    private Float queryYMin;

    @NotNull
    private Float queryYMax;

    private Field measure0;

    private Field measure1;

    private Field lat;

    private Field lon;

    private Set<Field> dimensions = new HashSet<>();


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

    public boolean getHasHeader() {
        return hasHeader;
    }

    public void setHasHeader(Boolean hasHeader) {
        this.hasHeader = hasHeader;
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
        return this;
    }

    public Dataset removeDimensions(Field field) {
        this.dimensions.remove(field);
        return this;
    }

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
