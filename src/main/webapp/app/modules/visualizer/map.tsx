import React, {useEffect, useState} from 'react';
import L from "leaflet";
import {
  getRow,
  selectDuplicateCluster,
  unselectDuplicateCluster,
  updateDrawnRect,
  updateExpandedClusterIndex,
  updateMapBounds,
} from "app/modules/visualizer/visualizer.reducer";
import {MapContainer, Marker, Polyline, Popup, TileLayer, ZoomControl} from "react-leaflet";
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import {IDataset} from "app/shared/model/dataset.model";
import {MAX_ZOOM} from "app/config/constants";
import {BeautifyIcon} from "app/modules/visualizer/beautify-marker/leaflet-beautify-marker-icon";


export interface IMapProps {
  id: any,
  clusters: any,
  dataset: IDataset,
  showDuplicates: any,
  zoom: any,
  viewRect: any,
  updateMapBounds: typeof updateMapBounds,
  updateDrawnRect: typeof updateDrawnRect,
  selectedDuplicate: any,
  selectDuplicateCluster: typeof selectDuplicateCluster,
  unselectDuplicateCluster: typeof unselectDuplicateCluster,
  updateExpandedClusterIndex: typeof updateExpandedClusterIndex,
  getRow: typeof getRow,
  row: string[],
  expandedClusterIndex: number,
}


const fetchIcon = (count, unmergedCount) => {
  // if (count === 1) return new L.Icon.Default();
  /*    if (count === 1) return L.icon({
        iconUrl: './content/images/duplicate-marker.png',
        iconSize:     [38, 38], // size of the icon
      });*/

  /*  if (count === 1) return L.divIcon({
      html: `<div><span></span></div>`,
      className: `marker-cluster marker-cluster-single`,
      iconSize: L.point(20, 20)
    });*/

  if (count === 1) return BeautifyIcon.icon({
    iconShape: 'doughnut',
    isAlphaNumericIcon: false,
    backgroundColor: "rgba(212,62,42)",
    borderColor: "#ffffff",
    borderWidth: 2,
    iconSize: [18, 18],
    hasBadge: false,
  });

  const backgroundColor = count < 100 ? 'rgba(102, 194, 164, 0.8)' :
    count < 1000 ? 'rgba(44, 162, 95, 0.8)' : 'rgba(0, 109, 44, 0.8)';

  const borderColor = count < 100 ? 'rgba(102, 194, 164, 0.5)' :
    count < 1000 ? 'rgba(44, 162, 95, 0.5)' : 'rgba(0, 109, 44, 0.5)';


  return BeautifyIcon.icon({
    customClasses: 'cluster',
    isAlphaNumericIcon: true,
    textColor: "black",
    text: count,
    hasBadge: count !== unmergedCount,
    badgeText: unmergedCount,
    backgroundColor,
    borderColor,
    borderWidth: 5,
    iconSize: [40, 40],
  });
};

const fetchDedupIcon = (count, isSelected) => {
  return BeautifyIcon.icon({
    iconShape: 'doughnut',
    isAlphaNumericIcon: false,
    textColor: "black",
    backgroundColor: isSelected ? "#21ba45" : "rgba(212,62,42)",
    borderColor: "#ffffff",
    borderWidth: 2,
    iconSize: [18, 18],
    hasBadge: true,
    badgeText: count,
  });
};

const SinglePoint = (props: any) => {
  const {dataset, point, coordinates, row} = props;
  return point[2] === 1 ?
    <Marker key={point[2]} icon={fetchIcon(1, 1)} position={[coordinates[1], coordinates[0]]}>
      <Popup onOpen={() => {
        props.getRow(dataset.id, point[3]);
      }}>
        <div style={{
          maxHeight: "200px",
          overflowY: "scroll"
        }}>{row && dataset.headers && dataset.headers.map((colName, colIndex) => {
          let val = row[colIndex];

          if (val == null) val = "";
          return (
            <div key={colIndex}>
                    <span>
                    <b>{colName}: </b>{val}
                    </span>
              <br></br>
            </div>
          )
        })}</div>
      </Popup>
    </Marker> :
    <Marker key={point[5]} icon={fetchDedupIcon(point[2], point === props.selectedDuplicate)}
            position={[coordinates[1], coordinates[0]]}
            eventHandlers={{
              click(e) {
                props.selectDuplicateCluster(point);
              },
            }}/>;
};


const SpiderfyCluster = (props: any) => {
  const {points, coordinates, dataset, row} = props;
  const angleStep = Math.PI * 2 / points.length;
  const legLength = 0.0003;
  return <>{points.map((point, i) => {
      const angle = i * angleStep;
      const newCoords = [coordinates[0] + legLength * Math.cos(angle), coordinates[1] + legLength * Math.sin(angle)];
      return <>
        <SinglePoint dataset={dataset}
                     point={point} row={row}
                     getRow={props.getRow}
                     coordinates={newCoords} selectDuplicateCluster={props.selectDuplicateCluster}
                     selectedDuplicate={props.selectedDuplicate}/>
        <Polyline pathOptions={{color: 'gray'}}
                  positions={[[coordinates[1], coordinates[0]], [newCoords[1], newCoords[0]]]}/>
      </>;
    }
  )}</>;
};

export const Map = (props: IMapProps) => {

  const {clusters, dataset, showDuplicates, selectedDuplicate, row, expandedClusterIndex} = props;

  const [map, setMap] = useState(null);


  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // @ts-ignore
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        polygon: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: true,
      },
    });
    map.addControl(drawControl);

    // @ts-ignore
    map.on(L.Draw.Event.CREATED, (e) => {
      const type = e.layerType;
      const layer = e.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      props.updateDrawnRect(props.id, layer._bounds);
    });
    // @ts-ignore
    map.on(L.Draw.Event.DELETED, (e) => {
      props.updateDrawnRect(props.id, null);
    });

    map.on('moveend', (e) => {
      props.updateMapBounds(props.id, e.target.getBounds(), e.target.getZoom());
    });

    map.on('click', e => {
      props.updateExpandedClusterIndex(null);
    });

    map.fitBounds([[dataset.queryYMin, dataset.queryXMin], [dataset.queryYMax, dataset.queryXMax]]);
  }, [map])


  return <MapContainer scrollWheelZoom={true} whenCreated={setMap} zoomControl={false} maxZoom={MAX_ZOOM}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {clusters && clusters.map((cluster, index) => {
      // every cluster point has coordinates
      // the point may be either a cluster or a single point
      const {
        totalCount, unmergedCount, points
      } = cluster.properties;
      if (totalCount === 1) {
        return <SinglePoint dataset={dataset} point={points[0]} row={row} getRow={props.getRow}
                            coordinates={cluster.geometry.coordinates}
                            selectDuplicateCluster={props.selectDuplicateCluster}
                            selectedDuplicate={props.selectedDuplicate}/>
      } else if (expandedClusterIndex === index) {
        return <SpiderfyCluster dataset={dataset} points={points} coordinates={cluster.geometry.coordinates} row={row}
                                getRow={props.getRow} selectDuplicateCluster={props.selectDuplicateCluster}
                                selectedDuplicate={props.selectedDuplicate}/>
      }
      return <Marker key={"cluster" + index}
                     position={[cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]]}
                     icon={fetchIcon(totalCount, unmergedCount)}
                     eventHandlers={{
                       click(e) {
                         map.getZoom() === MAX_ZOOM && props.updateExpandedClusterIndex(index);
                         e.originalEvent.stopPropagation();
                       },
                     }}> </Marker>;
    })}

    <Marker position={[40.75795780927519, -73.98551938996594]}
            icon={L.divIcon({
              html: `<i class="star blue icon" style="font-size: 2.5em"></i>`,
              className: `marker`,
              iconSize: L.point(50, 50)
            })}/>
    {/*    {showDuplicates && duplicates && duplicates.map((duplicate, index) => {
      return (
        <Marker key={`marker-${index}`}
                position={[duplicate[1], duplicate[0]]}
                icon={fetchDedupIcon(duplicate[2], index === selectedDedupClusterIndex)}
                eventHandlers={{
                  click(e) {
                    props.selectDuplicateCluster(index);
                  },

                }}
        />);
    })}*/}
    <ZoomControl position="topright"/>
  </MapContainer>;


};


export default Map;
