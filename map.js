const HOME_COORD = [49.26487532033742, -123.25278132880702];
const DEFAULT_ZOOM = 15;

// init map
const map = L.map("map", {
  zoomDelta: 0.5,
  zoomSnap: 0,
  wheelPxPerZoomLevel: 150,
  zoomControl: false
});
map.setView(HOME_COORD, DEFAULT_ZOOM);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const zoomHome = L.Control.zoomHome({
  position: "topleft",
  zoomHomeTitle: "Reset view",
  homeCoordinates: HOME_COORD,
  homeZoom: DEFAULT_ZOOM,
});
zoomHome.addTo(map);

// load data points
function createPopupContent(location) {
  const locationName = location.code;
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
      <h3 class="location-name">${locationName}</h3>
      <ul class="printers-list">
        ${printersList}
      </ul>
    </div>
  `;
}

function renderLocations(locations) {
  locations.forEach((location) => {
    // Skip locations without coordinates
    if (location.lat === null || location.long === null) return;

    const marker = L.marker([location.lat, location.long]);
    const popupContent = createPopupContent(location);
    marker.bindPopup(popupContent);
    marker.addTo(map);
  });
}

fetch("./sample-data/main.json")
  .then((response) => response.json())
  .then((data) => renderLocations(data.locations));