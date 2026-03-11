package com.recruitment.placement_system.dto;

import java.util.Map;

public class ConversionMetrics {

    private int totalApplicants;
    private int totalSelected;
    private int totalRejected;
    private int totalPending;
    private double overallConversionRate; // selected / total * 100

    // Round-wise breakdown: stage → {total, selected, rejected}
    private Map<String, RoundStats> roundWiseStats;

    public ConversionMetrics() {}

    // ── Getters & Setters ────────────────────────────────────

    public int getTotalApplicants() { return totalApplicants; }
    public void setTotalApplicants(int totalApplicants) { this.totalApplicants = totalApplicants; }

    public int getTotalSelected() { return totalSelected; }
    public void setTotalSelected(int totalSelected) { this.totalSelected = totalSelected; }

    public int getTotalRejected() { return totalRejected; }
    public void setTotalRejected(int totalRejected) { this.totalRejected = totalRejected; }

    public int getTotalPending() { return totalPending; }
    public void setTotalPending(int totalPending) { this.totalPending = totalPending; }

    public double getOverallConversionRate() { return overallConversionRate; }
    public void setOverallConversionRate(double overallConversionRate) {
        this.overallConversionRate = overallConversionRate;
    }

    public Map<String, RoundStats> getRoundWiseStats() { return roundWiseStats; }
    public void setRoundWiseStats(Map<String, RoundStats> roundWiseStats) {
        this.roundWiseStats = roundWiseStats;
    }

    // ── Inner class for per-round stats ─────────────────────
    public static class RoundStats {
        private int total;
        private int selected;
        private int rejected;
        private int pending;
        private double conversionRate; // selected / total * 100

        public RoundStats() {}

        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }

        public int getSelected() { return selected; }
        public void setSelected(int selected) { this.selected = selected; }

        public int getRejected() { return rejected; }
        public void setRejected(int rejected) { this.rejected = rejected; }

        public int getPending() { return pending; }
        public void setPending(int pending) { this.pending = pending; }

        public double getConversionRate() { return conversionRate; }
        public void setConversionRate(double conversionRate) { this.conversionRate = conversionRate; }
    }
}