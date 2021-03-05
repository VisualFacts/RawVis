package gr.athenarc.imsi.visualfacts.tool.domain;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class VisQueryResults implements Serializable {

    private static final long serialVersionUID = 1L;

    List<GroupedStats> series;

    private List<float[]> points;

    private Map<Integer, List<String>> facets;

    private RectStats rectStats;

    private int fullyContainedTileCount;
    private int tileCount;
    private int pointCount;
    private int ioCount;

    private int totalTileCount;
    private int totalPointCount;


    public List<GroupedStats> getSeries() {
        return series;
    }

    public void setSeries(List<GroupedStats> series) {
        this.series = series;
    }

    public List<float[]> getPoints() {
        return points;
    }

    public void setPoints(List<float[]> points) {
        this.points = points;
    }

    public Map<Integer, List<String>> getFacets() {
        return facets;
    }

    public void setFacets(Map<Integer, List<String>> facets) {
        this.facets = facets;
    }

    public RectStats getRectStats() {
        return rectStats;
    }

    public void setRectStats(RectStats rectStats) {
        this.rectStats = rectStats;
    }

    public int getFullyContainedTileCount() {
        return fullyContainedTileCount;
    }

    public void setFullyContainedTileCount(int fullyContainedTileCount) {
        this.fullyContainedTileCount = fullyContainedTileCount;
    }

    public int getTileCount() {
        return tileCount;
    }

    public void setTileCount(int tileCount) {
        this.tileCount = tileCount;
    }

    public int getPointCount() {
        return pointCount;
    }

    public void setPointCount(int pointCount) {
        this.pointCount = pointCount;
    }

    public int getIoCount() {
        return ioCount;
    }

    public void setIoCount(int ioCount) {
        this.ioCount = ioCount;
    }

    public int getTotalTileCount() {
        return totalTileCount;
    }

    public void setTotalTileCount(int totalTileCount) {
        this.totalTileCount = totalTileCount;
    }

    public int getTotalPointCount() {
        return totalPointCount;
    }

    public void setTotalPointCount(int totalPointCount) {
        this.totalPointCount = totalPointCount;
    }

    @Override
    public String toString() {
        return "VisQueryResults{" +
            "series=" + series +
            ", facets=" + facets +
            ", rectStats=" + rectStats +
            ", fullyContainedTileCount=" + fullyContainedTileCount +
            ", tileCount=" + tileCount +
            ", pointCount=" + pointCount +
            ", ioCount=" + ioCount +
            '}';
    }
}
