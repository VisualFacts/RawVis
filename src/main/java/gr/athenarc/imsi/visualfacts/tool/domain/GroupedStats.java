package gr.athenarc.imsi.visualfacts.tool.domain;

import java.util.List;

public class GroupedStats {

    private List<String> group;
    private Double value;

    public GroupedStats(List<String> group, Double value) {
        this.group = group;
        this.value = value;
    }

    public List<String> getGroup() {
        return group;
    }

    public void setGroup(List<String> group) {
        this.group = group;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "GroupedStats{" +
            "group=" + group +
            ", value=" + value +
            '}';
    }
}
