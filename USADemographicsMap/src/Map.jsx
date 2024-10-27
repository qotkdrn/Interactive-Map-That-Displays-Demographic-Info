// src/Map.js
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 37.0902, // Latitude for the United States
  lng: -95.7129, // Longitude for the United States
};

const options = {
  disableDefaultUI: true, // Disables the default UI for a cleaner look
  zoomControl: true, // Enables zoom control
};

const Map = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4} // Adjust initial zoom level
        options={options}
      >
        { /* Add any markers or overlays here */ }
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
