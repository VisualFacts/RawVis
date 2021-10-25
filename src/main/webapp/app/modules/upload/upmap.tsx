import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import * as Actions from './upload-reducer';

const Map = props => {
  const displayInfo = useSelector((state: Actions.RootState) => state.displayInfo);
  return (
    <div>
      {props.Coordinates !== null && (
        <MapContainer className="leaflet-map" center={[props.Coordinates[0][0], props.Coordinates[0][1]]} zoom={2}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {displayInfo.lat !== null &&
            displayInfo.lon !== null &&
            props.Coordinates.map((coordinate, idx) => <Marker key={idx} position={[coordinate[0], coordinate[1]]} />)}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
