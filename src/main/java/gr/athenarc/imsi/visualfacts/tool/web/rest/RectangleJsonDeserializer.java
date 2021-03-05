package gr.athenarc.imsi.visualfacts.tool.web.rest;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.collect.Range;
import gr.athenarc.imsi.visualfacts.Rectangle;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class RectangleJsonDeserializer extends JsonDeserializer<Rectangle> {

    @Override
    public Rectangle deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        TreeNode treeNode = jsonParser.getCodec().readTree(jsonParser);
        ArrayNode lat = (ArrayNode) treeNode.get("lat");
        ArrayNode lon = (ArrayNode) treeNode.get("lon");
        return new Rectangle(Range.open(lon.get(0).floatValue(), lon.get(1).floatValue()), Range.open(lat.get(0).floatValue(), lat.get(1).floatValue()));
    }
}
