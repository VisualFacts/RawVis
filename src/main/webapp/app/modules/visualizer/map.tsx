import React, {useEffect, useState} from 'react';
import L from "leaflet";
import {MapContainer, Marker, TileLayer, ZoomControl, Popup} from "react-leaflet";
import {updateDrawnRect, updateMapBounds, updateMap, toggleClusterChart, closeClusterChart} from "app/modules/visualizer/visualizer.reducer";
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import {IDataset} from "app/shared/model/dataset.model";
import { faColumns } from '@fortawesome/free-solid-svg-icons';


export interface IMapProps {
  id: any,
  clusters: any,
  duplicates: any,
  dataset: IDataset,
  showDuplicates: any,
  zoom:any,
  viewRect:any,
  showAll: any,
  columns: any,
  updateMapBounds: typeof updateMapBounds,
  updateDrawnRect: typeof updateDrawnRect,
  updateMap: typeof updateMap,
  toggleClusterChart: typeof toggleClusterChart,
  closeClusterChart: typeof closeClusterChart,
}



export const Map = (props: IMapProps) => {

  const {clusters, dataset, duplicates} = props;

  useEffect(()=> {
    return () => {
      if(props.viewRect != null){
        if (props.showDuplicates || props.showAll ) {
          props.updateMap(props.id, props.viewRect, props.zoom, false, props.showAll);
        }
        else  props.updateMap(props.id, props.viewRect, props.zoom, true, props.showAll);
      }
    };
  }, [props.showDuplicates, props.showAll]);


  const [map, setMap] = useState(null);
  const showDuplicatesRef = React.useRef();
  const showAllRef = React.useRef();
  showDuplicatesRef.current = props.showDuplicates;
  showAllRef.current = props.showAll;
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

    map.on('popupclose', (e) => {
      props.closeClusterChart();
    });
    
    map.on('moveend', (e) => {
      props.updateMapBounds(props.id, e.target.getBounds(), e.target.getZoom(), showDuplicatesRef.current, showAllRef.current);
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

  const fetchDedupIcon = count => {
    const size =
    count < 10 ? 'small' :
      count < 100 ? 'medium' : 'large';

    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster marker-cluster-${size} marker-duplicate`,
      iconSize: L.point(40, 40)
    });
  };
  

  return <MapContainer scrollWheelZoom={true} whenCreated={setMap} zoomControl={false} >
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
        <Marker key={`marker-${index}`} 
          position={[cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]]} 
          icon={fetchIcon(totalCount)}/>
      );
    })}
    { duplicates && duplicates.map((duplicate, index) => {
      return (
      <Marker key={`marker-${index}`}
      position={[duplicate[1], duplicate[0]]} 
      icon={fetchDedupIcon(duplicate[2])}
      eventHandlers={{
        click(e)  {
          props.toggleClusterChart(duplicate[4], duplicate[5], index + 1);
        },

      }}
      >
          <Popup className="request-popup">
            <div className="cluster-title">Cluster #{index + 1}</div>
           {props.columns && props.columns.map((col, colId) => {
                let val = duplicate[3][colId];
                if(val == null) val = "";
                return(
                  <div  className = {`dup-item ${val.includes("|") ? "active" : ""}`} 
                    key = {`dup-item-${index}-${colId} ${val.includes("|") ? "active" : ""}`}>
                    <span>
                    <b>{col}: </b>{val}
                    </span>
                    <br></br>
                  </div>
                ) 
                })}
          </Popup>
      </Marker>
      );
    })}
    <ZoomControl position="topright"/>
  </MapContainer>;


};


export default Map;
