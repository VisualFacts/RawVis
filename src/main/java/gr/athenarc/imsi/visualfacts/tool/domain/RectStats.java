package gr.athenarc.imsi.visualfacts.tool.domain;

import com.google.common.math.PairedStats;

public class RectStats {

    private long count;
    private Double mean0;
    private Double min0;
    private Double max0;
    private Double variance0;
    private Double standardDeviation0;

    private Double mean1;
    private Double min1;
    private Double max1;
    private Double variance1;
    private Double standardDeviation1;

    private Double pearsonCorrelation;
    private Double covariance;


    public RectStats(PairedStats pairedStats) {

        count = pairedStats.count();
        if (count != 0) {
            mean0 = pairedStats.xStats().mean();
            min0 = pairedStats.xStats().min();
            max0 = pairedStats.xStats().max();
            variance0 = pairedStats.xStats().populationVariance();
            standardDeviation0 = pairedStats.xStats().populationStandardDeviation();

            mean1 = pairedStats.yStats().mean();
            min1 = pairedStats.yStats().min();
            max1 = pairedStats.yStats().max();
            variance1 = pairedStats.yStats().populationVariance();
            standardDeviation1 = pairedStats.yStats().populationStandardDeviation();
            covariance = pairedStats.populationCovariance();
            try {
                pearsonCorrelation = pairedStats.pearsonsCorrelationCoefficient();
            } catch (IllegalStateException e) {
                pearsonCorrelation = null;
            }
        }
    }

    public long getCount() {
        return count;
    }

    public Double getMean0() {
        return mean0;
    }

    public Double getMin0() {
        return min0;
    }

    public Double getMax0() {
        return max0;
    }

    public Double getVariance0() {
        return variance0;
    }

    public Double getStandardDeviation0() {
        return standardDeviation0;
    }

    public Double getMean1() {
        return mean1;
    }

    public Double getMin1() {
        return min1;
    }

    public Double getMax1() {
        return max1;
    }

    public Double getVariance1() {
        return variance1;
    }

    public Double getStandardDeviation1() {
        return standardDeviation1;
    }

    public Double getPearsonCorrelation() {
        return pearsonCorrelation;
    }

    public Double getCovariance() {
        return covariance;
    }
}
