import React from 'react'
import { useState } from 'react'
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

console.log(apiKey)

const Map = () => {
  const [path, setPath] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey
  });

  console.log("isLoaded:", isLoaded);


  return (
    isLoaded 
    ? <GoogleMap
        mapContainerStyle = {{ width: '100%', height: '100%' }}
        center={{ lat: 39.8283, lng: 98.5795}}
        zoom={4}
      ></GoogleMap>
    : <p>Loading...</p>
  )
}

export default Map