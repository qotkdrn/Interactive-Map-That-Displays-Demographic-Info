const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMaps() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

loadGoogleMaps();
