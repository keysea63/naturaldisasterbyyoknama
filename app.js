// Initialize the map using Leaflet
const map = L.map('map').setView([37.7749, -122.4194], 5);  // Default to a view of the USA

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to fetch and display natural disaster alerts
function fetchAlerts() {
  // Wildfire API (NASA FIRMS)
  axios.get('https://eonet.gsfc.nasa.gov/api/v2.1/events?category=wildfires')
    .then(response => {
      const alerts = response.data.events;
      const wildfireAlertsContainer = document.getElementById('wildfire-alerts');
      alerts.forEach(event => {
        const alertItem = document.createElement('div');
        alertItem.classList.add('alert-item');
        alertItem.innerHTML = `
          <strong>${event.title}</strong><br>
          <small>${new Date(event.date).toLocaleString()}</small><br>
          <a href="${event.link}" target="_blank">More info</a>
        `;
        wildfireAlertsContainer.appendChild(alertItem);

        // Add marker to map
        L.marker([event.geometries[0].coordinates[1], event.geometries[0].coordinates[0]])
          .addTo(map)
          .bindPopup(event.title);
      });
    }).catch(error => console.error('Error fetching wildfire data:', error));

  // Flood API (Copernicus or other endpoint)
  axios.get('https://your-flood-api-endpoint-here')
    .then(response => {
      const alerts = response.data.features;
      const floodAlertsContainer = document.getElementById('flood-alerts');
      alerts.forEach(event => {
        const alertItem = document.createElement('div');
        alertItem.classList.add('alert-item');
        alertItem.innerHTML = `
          <strong>${event.properties.title}</strong><br>
          <small>${new Date(event.properties.timestamp).toLocaleString()}</small><br>
          <a href="${event.properties.link}" target="_blank">More info</a>
        `;
        floodAlertsContainer.appendChild(alertItem);

        // Add marker to map
        L.marker([event.geometry.coordinates[1], event.geometry.coordinates[0]])
          .addTo(map)
          .bindPopup(event.properties.title);
      });
    }).catch(error => console.error('Error fetching flood data:', error));

  // Earthquake API (USGS Earthquakes)
  axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(response => {
      const alerts = response.data.features;
      const earthquakeAlertsContainer = document.getElementById('earthquake-alerts');
      alerts.forEach(event => {
        const alertItem = document.createElement('div');
        alertItem.classList.add('alert-item');
        alertItem.innerHTML = `
          <strong>Earthquake: ${event.properties.title}</strong><br>
          <small>Magnitude: ${event.properties.mag}</small><br>
          <a href="https://earthquake.usgs.gov/earthquakes/eventpage/${event.id}" target="_blank">More info</a>
        `;
        earthquakeAlertsContainer.appendChild(alertItem);

        // Add marker to map
        L.marker([event.geometry.coordinates[1], event.geometry.coordinates[0]])
          .addTo(map)
          .bindPopup(event.properties.title);
      });
    }).catch(error => console.error('Error fetching earthquake data:', error));

  // Tsunami API (PTWC Tsunami Alerts)
  axios.get('https://www.weather.gov/ptwc/')
    .then(response => {
      const tsunamiAlertsContainer = document.getElementById('tsunami-alerts');
      // Handle the PTWC Tsunami Data Response (update this part as needed)
      // Example assuming data structure
      response.data.features.forEach(event => {
        const alertItem = document.createElement('div');
        alertItem.classList.add('alert-item');
        alertItem.innerHTML = `
          <strong>Tsunami: ${event.properties.title}</strong><br>
          <small>${new Date(event.properties.timestamp).toLocaleString()}</small><br>
          <a href="${event.properties.link}" target="_blank">More info</a>
        `;
        tsunamiAlertsContainer.appendChild(alertItem);

        // Add marker to map
        L.marker([event.geometry.coordinates[1], event.geometry.coordinates[0]])
          .addTo(map)
          .bindPopup(event.properties.title);
      });
    }).catch(error => console.error('Error fetching tsunami data:', error));
}

// Ask the user for their location and place a marker
function setUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      // Center the map on the user's location and add a marker
      map.setView([userLat, userLon], 10);
      L.marker([userLat, userLon]).addTo(map)
        .bindPopup("You are here")
        .openPopup();
    }, error => {
      console.error("Error getting user location:", error);
      alert("Location access denied. Showing default location.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Run the fetchAlerts and setUserLocation functions when the page loads
window.onload = function() {
  fetchAlerts();
  setUserLocation();
};



