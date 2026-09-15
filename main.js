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
}

async function chargerParkings() {
  groupe.clearLayers();

  data.parkings.forEach((p) => {
    if (p.distance_m <= curseur.value) {
      L.marker(p.lat_long)
        .addTo(groupe)
        .bindPopup(
          `<strong>${p.nom}</strong><br>${p.tarif}` +
            (p.nombre_places ? `<br>${p.nombre_places} places` : ""),
        );
    }
  });
}

curseur.addEventListener("input", updateLabel);
init().then(updateLabel);
