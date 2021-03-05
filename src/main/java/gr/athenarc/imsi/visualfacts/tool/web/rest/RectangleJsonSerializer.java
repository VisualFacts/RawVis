package gr.athenarc.imsi.visualfacts.tool.web.rest;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import gr.athenarc.imsi.visualfacts.Rectangle;
import org.springframework.boot.jackson.JsonComponent;

import java.io.IOException;

@JsonComponent
public class RectangleJsonSerializer extends JsonSerializer<Rectangle> {

    @Override
    public void serialize(Rectangle rectangle, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

        jsonGenerator.writeStartObject();
        jsonGenerator.writeArrayFieldStart("lat");
        jsonGenerator.writeEndArray();
        jsonGenerator.writeArrayFieldStart("lon");
        jsonGenerator.writeEndArray();

    }
}
