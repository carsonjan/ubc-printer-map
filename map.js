const HOME_COORD = [49.26487532033742, -123.25278132880702];
const DEFAULT_ZOOM = 15;

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