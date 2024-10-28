import React, { useEffect } from 'react';
import { loadGoogleMapsAPI } from './googleMapsLoader';

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 37.0902, lng: -95.7129 },
    zoom: 8,
  });
}

const Map = () => {
  useEffect(() => {
    loadGoogleMapsAPI();
    window.initMap = initMap; // Set as global function for callback
  }, []);

  return <div id="map"></div>;
};

export default Map;
