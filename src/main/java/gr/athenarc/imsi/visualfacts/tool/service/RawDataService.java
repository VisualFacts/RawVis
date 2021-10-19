package gr.athenarc.imsi.visualfacts.tool.service;

import com.github.davidmoten.geo.Coverage;
import com.github.davidmoten.geo.GeoHash;
import com.github.davidmoten.geo.LatLong;
import com.google.common.collect.Range;
import gr.athenarc.imsi.visualfacts.*;
import gr.athenarc.imsi.visualfacts.query.QueryResults;
import gr.athenarc.imsi.visualfacts.tool.config.ApplicationProperties;
import gr.athenarc.imsi.visualfacts.tool.domain.*;
import gr.athenarc.imsi.visualfacts.tool.domain.enumeration.AggregateFunctionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static gr.athenarc.imsi.visualfacts.config.IndexConfig.DELIMITER;

@Service
public class RawDataService {

    private final Logger log = LoggerFactory.getLogger(RawDataService.class);
    private final ApplicationProperties applicationProperties;
    private HashMap<String, Veti> indexes = new HashMap<>();

    public RawDataService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    public void removeIndex(Dataset dataset) {
        indexes.remove(dataset.getId());
    }

    private synchronized Veti getIndex(Dataset dataset) throws IOException {
        Veti veti = indexes.get(dataset.getId());
        if (veti != null) {
            return veti;
        }
        Integer measureCol0 = null;
        Integer measureCol1 = null;
        if (dataset.getMeasure0() != null) {
            measureCol0 = dataset.getMeasure0();
        }

        if (dataset.getMeasure1() != null) {
            measureCol1 = dataset.getMeasure1();
        }
        Schema schema = new Schema(new File(applicationProperties.getWorkspacePath(), dataset.getName()).getAbsolutePath(), DELIMITER,
            dataset.getLon(), dataset.getLat(), measureCol0, measureCol1,
            new Rectangle(Range.open(dataset.getxMin(), dataset.getxMax()), Range.open(dataset.getyMin(), dataset.getyMax())), dataset.getObjectCount(), -1);
        List<CategoricalColumn> categoricalColumns = dataset.getDimensions().stream().map(field -> new CategoricalColumn(field)).collect(Collectors.toList());
        schema.setCategoricalColumns(categoricalColumns);
        schema.setHasHeader(dataset.getHasHeader());
        schema.setDedupCols(dataset.getDedupCols());
        schema.setBlockingCols(dataset.getBlockingCols());
        veti = new Veti(schema, 100000000, "binn", 100);
        this.indexes.put(dataset.getId(), veti);
        return veti;
    }

    public Integer getObjectsIndexed(String id) {
        Veti index = indexes.get(id);
        return index == null ? 0 : index.getObjectsIndexed();
    }

    public boolean isIndexInitialized(String id) {
        Veti index = indexes.get(id);
        return index != null && index.isInitialized();
    }

    public String[] getObject(Dataset dataset, long objectId) {
        try {
            Veti veti = this.getIndex(dataset);
            return veti.getObject(objectId);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    public VisQueryResults executeQuery(Dataset dataset, VisQuery query) {
        log.debug(query.toString());
        try {
            Veti veti = this.getIndex(dataset);
            Schema schema = veti.getSchema();
            QueryResults results = veti.executeQuery(query);
            VisQueryResults visQueryResults = new VisQueryResults();
            visQueryResults.setFullyContainedTileCount(results.getFullyContainedTileCount());
            visQueryResults.setIoCount(results.getIoCount());
            visQueryResults.setPointCount(results.getPoints().size());
            visQueryResults.setTileCount(results.getTileCount());
            visQueryResults.setTotalPointCount(veti.getObjectsIndexed());
            visQueryResults.setTotalTileCount(veti.getLeafTileCount());
            visQueryResults.setDedupVizOutput(results.getDedupVizOutput());

            if (results.getRectStats() != null) {
                visQueryResults.setRectStats(new RectStats(results.getRectStats().snapshot()));
            }
            visQueryResults.setSeries(results.getStats().entrySet().stream().map(e ->
                new GroupedStats(e.getKey(), AggregateFunctionType.getAggValue(query.getAggType(),
                    query.getMeasureCol().equals(schema.getMeasureCol0()) ? e.getValue().xStats() : e.getValue().yStats()))).collect(Collectors.toList()));
            List<Point> points;
            if (results.getPoints() != null) {
                points = results.getPoints();
            } else {
                points = new ArrayList<>();
            }
            //Collections.shuffle(points);
            //visQueryResults.setPoints(points.subList(0, Math.min(1000000, points.size())));

            // Map<String, Float> geoHashes = new HashMap<>();

            /*Coverage coverage = GeoHash.coverBoundingBoxMaxHashes(query.getRect().getYRange().upperEndpoint(), query.getRect().getXRange().lowerEndpoint(), query.getRect().getYRange().lowerEndpoint(), query.getRect().getXRange().upperEndpoint(), 10000);
            points.stream().forEach(point -> {
                String geoHashValue = GeoHash.encodeHash(point.getY(), point.getX(), coverage.getHashLength());
                geoHashes.merge(geoHashValue, 1f, Float::sum);
            });

            visQueryResults.setPoints(geoHashes.entrySet().stream().map(e -> {
                LatLong latLong = GeoHash.decodeHash(e.getKey());
                return new float[]{(float) latLong.getLat(), (float) latLong.getLon(), e.getValue()};
            }).collect(Collectors.toList()));*/
            visQueryResults.setPoints(points.stream().map(point -> new Object[]{point.getY(), point.getX(), 1, point.getFileOffset()}).collect(Collectors.toList()));
            visQueryResults.setFacets(schema.getCategoricalColumns().stream().collect(Collectors.toMap(CategoricalColumn::getIndex, CategoricalColumn::getNonNullValues)));
            return visQueryResults;
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
