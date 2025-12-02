const HOME_COORD = [49.26487532033742, -123.25278132880702];
const DEFAULT_ZOOM = 15;
let locationMarker = null;

// init map
const map = L.map("map", {
    zoomDelta: 0.5,
    zoomSnap: 0,
    wheelPxPerZoomLevel: 150,
    zoomControl: false,
});
map.setView(HOME_COORD, DEFAULT_ZOOM);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const zoomHome = L.Control.zoomHome({
    position: "bottomright",
    zoomHomeTitle: "Reset view",
    homeCoordinates: HOME_COORD,
    homeZoom: DEFAULT_ZOOM,
});
zoomHome.addTo(map);

// load data points
function createPopupContent(location) {
    const locationCode = location.code;
    const locationName = location.name;
    const locationLimit = location.limit;
    const printersList = location.printers
        .map(
            (printer) => `
      <li class="printer-item">
        <span class="printer-room">${printer.room}</span>
        <span class="printer-code" title="${printer.code}">${printer.code}</span>
      </li>
    `
        )
        .join("");

    return `
    <div class="location-popup">
      <h3 class="location-name">${
          locationName ? locationName : locationCode
      }</h3>
      ${locationLimit ? `<div><em>${locationLimit}<em><div>` : ""}
      <ul class="printers-list">
        ${printersList}
      </ul>
    </div>
  `;
}

async function renderLocations() {
    const promise = await fetch("./data/main.json");
    const data = await promise.json();
    const locations = data.locations;

    const printerIcon = L.icon({ iconUrl: "./assets/printer-fill.svg" , iconSize:[25]});
    addLocationMarkers(locations, printerIcon);
}

async function renderExtraLocations() {
    const promise = await fetch("./data/extra.json");
    const data = await promise.json();
    const locations = data.locations;

    const printerIcon = L.icon({
        iconUrl: "./assets/printer.svg",
        iconSize: [25],
    });
    addLocationMarkers(locations, printerIcon);
}

function addLocationMarkers(locations, icons) {
  locations.forEach((location) => {
      // Skip locations without coordinates
      if (location.lat === null || location.long === null) return;

      const marker = L.marker([location.lat, location.long], {
          icon: icons,
      });
      const popupContent = createPopupContent(location);
      marker.bindPopup(popupContent);
      marker.addTo(map);
  });
}

// geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Location is not supported by this browser.");
    }
}

function success(position) {
  const locationIcon = L.icon({iconUrl: "./assets/location.svg", iconSize:[20]})
    const newLocation = [position.coords.latitude, position.coords.longitude];
    if (locationMarker) {
        map.removeLayer(locationMarker);
    }
    locationMarker = L.marker(newLocation, { icon: locationIcon });
    locationMarker.setLatLng(newLocation);
    // console.log(
    //     "located" + [position.coords.latitude, position.coords.longitude]
    // );
    locationMarker.addTo(map);
    map.setView(newLocation, DEFAULT_ZOOM+1);
}

function error() {
    alert("Location not available. Please grant location permission");
}

renderLocations();
renderExtraLocations();
window.getLocation = getLocation;
