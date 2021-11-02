package gr.athenarc.imsi.visualfacts.tool.domain;

import gr.athenarc.imsi.visualfacts.queryER.VizUtilities.DedupVizOutput;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class VisQueryResults implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Object[]> points;

    private Map<Integer, List<String>> facets;

    List<GroupedStats> series;

    private RectStats rectStats;

    List<GroupedStats> cleanedSeries;

    private RectStats cleanedRectStats;

    private int fullyContainedTileCount;
    private int tileCount;
    private int pointCount;
    private int ioCount;

    private int totalTileCount;
    private int totalPointCount;

    private DedupVizOutput dedupVizOutput;


    public List<GroupedStats> getSeries() {
        return series;
    }

    public void setSeries(List<GroupedStats> series) {
        this.series = series;
    }

    public List<Object[]> getPoints() {
        return points;
    }

    public void setPoints(List<Object[]> points) {
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

    public List<GroupedStats> getCleanedSeries() {
        return cleanedSeries;
    }

    public void setCleanedSeries(List<GroupedStats> cleanedSeries) {
        this.cleanedSeries = cleanedSeries;
    }

    public RectStats getCleanedRectStats() {
        return cleanedRectStats;
    }

    public void setCleanedRectStats(RectStats cleanedRectStats) {
        this.cleanedRectStats = cleanedRectStats;
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

    public DedupVizOutput getDedupVizOutput() {
        return dedupVizOutput;
    }

    public void setDedupVizOutput(DedupVizOutput dedupVizOutput) {
        this.dedupVizOutput = dedupVizOutput;
    }

    @Override
    public String toString() {
        return "VisQueryResults{" +
            ", fullyContainedTileCount=" + fullyContainedTileCount +
            ", tileCount=" + tileCount +
            ", pointCount=" + pointCount +
            ", ioCount=" + ioCount +
            '}';
    }
}
