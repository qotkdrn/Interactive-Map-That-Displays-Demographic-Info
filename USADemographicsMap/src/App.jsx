import React, { useEffect, useRef } from 'react';

const App = () => {
  const mapRef = useRef(null); // Create a reference to the map div

  useEffect(() => {
    let map;

    // Define the asynchronous function to initialize the map
    async function initMap() {
      const { Map } = await google.maps.importLibrary("maps");

      // Initialize the map within the referenced div
      map = new Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }

    initMap(); // Call the function to initialize the map

    // Cleanup function to remove map if component unmounts
    return () => {
      if (map) {
        map = null;
      }
    };
  }, []);

  return (
    <div>
      <h1>App</h1>
      <div 
        ref={mapRef} // Attach the ref to the div
        style={{ width: '100%', height: '400px' }} // Add height and width styling
      ></div>
    </div>
  );
};

export default App;
