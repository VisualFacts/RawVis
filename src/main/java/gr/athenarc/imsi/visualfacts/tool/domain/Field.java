package gr.athenarc.imsi.visualfacts.tool.domain;
import java.io.Serializable;

/**
 * A Field.
 */
public class Field implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private Integer fieldIndex;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getFieldIndex() {
        return fieldIndex;
    }

    public void setFieldIndex(Integer fieldIndex) {
        this.fieldIndex = fieldIndex;
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
