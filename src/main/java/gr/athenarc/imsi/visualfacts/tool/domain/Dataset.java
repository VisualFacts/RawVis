package gr.athenarc.imsi.visualfacts.tool.domain;


import gr.athenarc.imsi.visualfacts.tool.domain.enumeration.DatasetType;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.*;

/**
 * A Dataset.
 */
public class Dataset implements Serializable {

    private static final long serialVersionUID = 1L;


    private String id;

    @NotNull
    private String name;

    private DatasetType type;

    private Boolean hasHeader;

    private String[] headers;

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

    private Integer measure0;

    private Integer measure1;

    private Integer lat;

    private Integer lon;

    private LinkedHashSet<Integer> dimensions = new LinkedHashSet<>();

    private Set<Integer> dedupCols = new HashSet<>();

    private Set<Integer> blockingCols = new HashSet<>();


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

    public Boolean getHasHeader() {
        return hasHeader;
    }

    public void setHasHeader(Boolean hasHeader) {
        this.hasHeader = hasHeader;
    }

    public String[] getHeaders() {
        return headers;
    }

    public void setHeaders(String[] headers) {
        this.headers = headers;
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

    public Integer getMeasure0() {
        return measure0;
    }

    public void setMeasure0(Integer measure0) {
        this.measure0 = measure0;
    }

    public Integer getMeasure1() {
        return measure1;
    }

    public void setMeasure1(Integer measure1) {
        this.measure1 = measure1;
    }

    public Integer getLat() {
        return lat;
    }

    public void setLat(Integer lat) {
        this.lat = lat;
    }

    public Integer getLon() {
        return lon;
    }

    public void setLon(Integer lon) {
        this.lon = lon;
    }

    public LinkedHashSet<Integer> getDimensions() {
        return dimensions;
    }

    public void setDimensions(LinkedHashSet<Integer> dimensions) {
        this.dimensions = dimensions;
    }

    public Set<Integer> getDedupCols() {
        return dedupCols;
    }

    public void setDedupCols(Set<Integer> dedupCols) {
        this.dedupCols = dedupCols;
    }


    public Set<Integer> getBlockingCols() {
        return blockingCols;
    }

    public void setBlockingCols(Set<Integer> blockingCols) {
        this.blockingCols = blockingCols;
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

    @Override
    public String toString() {
        return "Dataset{" +
            "id='" + id + '\'' +
            ", name='" + name + '\'' +
            ", type=" + type +
            ", hasHeader=" + hasHeader +
            ", headers=" + Arrays.toString(headers) +
            ", objectCount=" + objectCount +
            ", xMin=" + xMin +
            ", xMax=" + xMax +
            ", yMin=" + yMin +
            ", yMax=" + yMax +
            ", queryXMin=" + queryXMin +
            ", queryXMax=" + queryXMax +
            ", queryYMin=" + queryYMin +
            ", queryYMax=" + queryYMax +
            ", measure0=" + measure0 +
            ", measure1=" + measure1 +
            ", lat=" + lat +
            ", lon=" + lon +
            ", dimensions=" + dimensions +
            ", dedupCols=" + dedupCols +
            ", blockingCols=" + blockingCols +
            '}';
    }
}
