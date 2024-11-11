import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import countiesData from './counties.json'; // Import your GeoJSON file
import CountiesVisited from './CountiesVisited'; // Import the new page component

const App = () => {
  const mapRef = useRef(null); // Create a reference to the map div
  let map; // Declare map outside of useEffect
  let infoWindow; // Declare infoWindow outside useEffect for reuse

  // Map state FIPS codes to state names
  const stateCodeToName = {
    "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas",
    "06": "California", "08": "Colorado", "09": "Connecticut", "10": "Delaware",
    "11": "District of Columbia", "12": "Florida", "13": "Georgia", "15": "Hawaii",
    "16": "Idaho", "17": "Illinois", "18": "Indiana", "19": "Iowa", "20": "Kansas",
    "21": "Kentucky", "22": "Louisiana", "23": "Maine", "24": "Maryland",
    "25": "Massachusetts", "26": "Michigan", "27": "Minnesota", "28": "Mississippi",
    "29": "Missouri", "30": "Montana", "31": "Nebraska", "32": "Nevada",
    "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico", "36": "New York",
    "37": "North Carolina", "38": "North Dakota", "39": "Ohio", "40": "Oklahoma",
    "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island", "45": "South Carolina",
    "46": "South Dakota", "47": "Tennessee", "48": "Texas", "49": "Utah",
    "50": "Vermont", "51": "Virginia", "53": "Washington", "54": "West Virginia",
    "55": "Wisconsin", "56": "Wyoming"
  };

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

  const recordVisit = async (countyId, countyName) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Check if token exists before making the request
    if (!token) {
      console.error('No token found in localStorage.');
      return;
    }
    
    const response = await fetch('http://localhost:5000/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, county_id: countyId, county_name: countyName }),
    });
  
    if (response.ok) {
      const visit = await response.json();
      console.log('Visit recorded:', visit);
    } else {
      console.error('Failed to record visit');
    }
  };

  // Function to generate a 13-character random token
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Retrieve or set token in localStorage
  const getToken = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      token = generateToken();
      localStorage.setItem('token', token);
    }
    return token;
  };

  const token = getToken(); // Retrieve the token here for use

  useEffect(() => {
    // Define the asynchronous function to initialize the map
    async function initMap() {
      const { Map, InfoWindow } = await google.maps.importLibrary("maps");

      // Initialize the map within the referenced div
      map = new Map(mapRef.current, {
        center: { lat: 36.7783, lng: -119.4179 },
        zoom: 7,
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
      map.data.addListener("click", async (event) => {
        // Get county name and demographic data from the feature's properties
        const countyName = event.feature.getProperty("NAME"); // Adjust based on your GeoJSON properties
        const stateCode = event.feature.getProperty("STATEFP"); // Adjust these property names as per your GeoJSON
        const countyCode = event.feature.getProperty("COUNTYFP");
        const stateName = stateCodeToName[stateCode] || "Unknown State";
        const apiKey = import.meta.env.VITE_CENSUS_DATA_API_KEY;
        const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,B02001_001E,B02001_002E,B02001_003E,B02001_004E,B02001_005E,B02001_006E,B02001_007E,B02001_008E,B19013_001E&for=county:${countyCode}&in=state:${stateCode}&key=${apiKey}`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();

          // Extract values for each race category
          const totalPopulation = parseInt(data[1][1]);
          const medianIncome = data[1][9] !== null ? parseInt(data[1][9]) : "Unavailable";
          const races = {
            "White": (parseInt(data[1][2]) / totalPopulation * 100).toFixed(2),
            "Black": (parseInt(data[1][3]) / totalPopulation * 100).toFixed(2),
            "American Indian": (parseInt(data[1][4]) / totalPopulation * 100).toFixed(2),
            "Asian": (parseInt(data[1][5]) / totalPopulation * 100).toFixed(2),
            "Native Hawaiian": (parseInt(data[1][6]) / totalPopulation * 100).toFixed(2),
            "Some Other Race": (parseInt(data[1][7]) / totalPopulation * 100).toFixed(2),
            "Two or More Races": (parseInt(data[1][8]) / totalPopulation * 100).toFixed(2),
          };

          infoWindow.setContent(`
            <div>
              <h2>${countyName} County, ${stateName}</h2>
              <p>Population: ${totalPopulation}</p>
              <p>Median Income: $${medianIncome}/yr</p>
              <h3>Racial Composition: </h3>
              <p>White: ${races.White}%</p>
              <p>Black: ${races.Black}%</p>
              <p>American Indian: ${races["American Indian"]}%</p>
              <p>Asian: ${races.Asian}%</p>
              <p>Native Hawaiian: ${races["Native Hawaiian"]}%</p>
              <p>Some Other Race: ${races["Some Other Race"]}%</p>
              <p>Two or More Races: ${races["Two or More Races"]}%</p>
            </div>
          `);

          infoWindow.setPosition(event.latLng);
          infoWindow.open(map);

          // Record the visit by sending the county ID to the backend
          recordVisit(countyCode,countyName); // Pass countyCode to record the visit
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });
    }
    
    // localStorage(() => {})
      // if local storage doesn't have token key, 
      // then generate random token and save to local storage
      // if token already exists get it from local storage

    // 1. generate token: random string that represents user
    // generate token first time user visits web page

    initMap(); // Call the function to initialize the map

    // Cleanup function to remove map if component unmounts
    return () => {
      if (map) {
        map = null; // This is not necessary, but you can keep it for clarity
      }
    };
  }, []);

  return (
    <Router>
      <div>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>US Demographics</h1>
          <Link to="/counties-visited">
            <button>Counties Visited</button>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={
            <div 
              ref={mapRef}
              style={{ width: '100vw', height: '100vh' }}
            ></div>
          } />
          <Route path="/counties-visited" element={<CountiesVisited />} />
        </Routes>
      </div>
    </Router>
  );
  
};

export default App;
