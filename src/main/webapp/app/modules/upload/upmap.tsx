import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './upload-reducer';

const Map = props => {
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  return (
    <div>
      <MapContainer center={[0, 0]} zoom={3}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {uploadState.coordinates.length !== 0 &&
          uploadState.coordinates.map((coordinate, idx) => <Marker key={idx} position={[coordinate[0], coordinate[1]]} />)}
      </MapContainer>
    </div>
  );
};

export default Map;
