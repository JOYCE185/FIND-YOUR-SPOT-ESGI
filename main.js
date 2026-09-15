const ECOLE = [43.5135, 5.4282];
const curseur = document.getElementById("filter-walk");
const label = document.getElementById("walk-label");

const carte = L.map("map").setView(ECOLE, 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(carte);
L.marker(ECOLE).addTo(carte).bindPopup("Campus ESGI Aix-en-Provence");

window.addEventListener("resize", () => carte.invalidateSize());
let cercle = null;
const groupe = L.layerGroup().addTo(carte);
let data = { parkings: [] };
let ligneActive = null;

async function init() {
  const reponse = await fetch("parkings.json");
  data = await reponse.json();
}

function updateLabel() {
  label.textContent = "≤ " + curseur.value + " m";
  if (cercle) cercle.remove();

  cercle = L.circle(ECOLE, {
    radius: curseur.value,
    color: "#26241f",
    weight: 1,
    dashArray: "4 6",
    fillColor: "#26241f",
    fillOpacity: 0.04,
  }).addTo(carte);
  chargerParkings();
  if (ligneActive) ligneActive.remove();
}

function chargerParkings() {
  groupe.clearLayers();

  data.parkings.forEach((p) => {
    if (p.distance_m <= curseur.value) {
      const marker = L.marker(p.lat_long)
        .addTo(groupe)
        .bindPopup(popupTemplate(p));
      marker.on("click", () => {
        if (ligneActive) ligneActive.remove();
        ligneActive = L.polyline([ECOLE, p.lat_long], {
          color: "#26241f",
          weight: 2,
          dashArray: "4 6",
        }).addTo(carte);
      });
    }
  });
}

curseur.addEventListener("input", updateLabel);
init().then(updateLabel);
