import React, { useEffect, useRef } from 'react';
import countiesData from './counties.json'; // Import your GeoJSON file

const App = () => {
  const mapRef = useRef(null); // Create a reference to the map div
  let map; // Declare map outside of useEffect
  let infoWindow; // Declare infoWindow outside useEffect for reuse

  const styles = [
    // Turn off all features except for natural and administrative labels.
    { elementType: "geometry", stylers: [{ visibility: "off" }] }, //terrain, roads, water
    { elementType: "labels", stylers: [{ visibility: "off" }] }, // city names, street names

    // Show natural geographic features like water and landscape.
    {
      featureType: "water", // all bodies of water
      elementType: "geometry", 
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "landscape", // natural land features, lands fields, etc.
      elementType: "geometry",
      stylers: [{ visibility: "on" }]
    },

    // Show administrative labels for cities and counties within the US.
    {
      featureType: "administrative.locality", // cities and towns
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "administrative.province", // state level administrative areas
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "poi", // points of interest (landmarks, parks)
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    },

    // Show state borders.
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "on" }, { weight: 1 }, { color: "#555555" }]
    },
    // Show county labels (usually neighborhoods in Google Maps styling)
    {
      featureType: "administrative.neighborhood",
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    }
  ];

  useEffect(() => {
    // Define the asynchronous function to initialize the map
    async function initMap() {
      const { Map, InfoWindow } = await google.maps.importLibrary("maps");

      // Initialize the map within the referenced div
      map = new Map(mapRef.current, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 10,
        styles: styles, // Apply custom styles
        restriction: { // Restrict panning to the US bounds
          latLngBounds: {
            north: 49.3457868,
            south: 24.396308,
            west: -125.0,
            east: -66.93457,
          },
          strictBounds: true,
        },
      });

      // Initialize the InfoWindow
      infoWindow = new InfoWindow();

      // Load and display GeoJSON data
      map.data.addGeoJson(countiesData);
      map.data.setStyle({
        fillColor: "blue",
        strokeWeight: 0.5,
        fillOpacity: 0
      });

      // Add mouseover and mouseout event listeners for hover effect
      map.data.addListener("mouseover", (event) => {
        map.data.overrideStyle(event.feature, { fillColor: "lightblue", fillOpacity: 0.5 });
      });

      map.data.addListener("mouseout", (event) => {
        map.data.revertStyle(event.feature);
      });

      // Add click event listener to open InfoWindow with county information
      map.data.addListener("click", (event) => {
        // Get county name and demographic data from the feature's properties
        const countyName = event.feature.getProperty("NAME"); // Adjust based on your GeoJSON properties
        // const demographicData = event.feature.getProperty("demographics"); // Example

        // Set content for the InfoWindow
        infoWindow.setContent(`
          <div>
            <h2>${countyName}</h2>
            <p>Population: </p>
            <p>Median Income: </p>
            <!-- Add more demographic information as needed -->
          </div>
        `);

        // Position the InfoWindow at the clicked location
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }

    initMap(); // Call the function to initialize the map

    // Cleanup function to remove map if component unmounts
    return () => {
      if (map) {
        map = null; // This is not necessary, but you can keep it for clarity
      }
    };
  }, []);

  return (
    <div>
      <h1>US Demographics</h1>
      <div 
        ref={mapRef} // Attach the ref to the div
        style={{ width: '100vw', height: '100vh' }} // Full screen map
      ></div>
    </div>
  );
};

export default App;
