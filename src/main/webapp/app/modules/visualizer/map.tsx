import React, {useEffect, useState} from 'react';
import L from "leaflet";
import {MapContainer, Marker, TileLayer, ZoomControl} from "react-leaflet";
import {updateDrawnRect, updateMapBounds} from "app/modules/visualizer/visualizer.reducer";
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import {IDataset} from "app/shared/model/dataset.model";


export interface IMapProps {
  id: any,
  clusters: any,
  dataset: IDataset,
  updateMapBounds: typeof updateMapBounds,
  updateDrawnRect: typeof updateDrawnRect,
}


export const Map = (props: IMapProps) => {
  const {clusters, dataset} = props;

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
    map.fitBounds([[dataset.queryYMin, dataset.queryXMin], [dataset.queryYMax, dataset.queryXMax]]);
  }, [map])

  const fetchIcon = count => {
    if (count === 1) return new L.Icon.Default();
    const size =
      count < 100 ? 'small' :
        count < 1000 ? 'medium' : 'large';

    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40)
    });
  };

  return <MapContainer scrollWheelZoom={true} whenCreated={setMap} zoomControl={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {clusters && clusters.map((cluster, index) => {
      // every cluster point has coordinates
      // the point may be either a cluster or a single point
      const {
        totalCount
      } = cluster.properties;
      return (
        <Marker key={`marker-${index}`} position={[cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]]} icon={fetchIcon(totalCount)}/>
      );
    })}
    <ZoomControl position="topright"/>
  </MapContainer>;


};


export default Map;
