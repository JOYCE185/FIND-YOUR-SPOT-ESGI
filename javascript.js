const ECOLE = [43.5135, 5.4282];
const curseur = document.getElementById("filter-walk");
const label = document.getElementById("walk-label");

const carte = L.map("map").setView(ECOLE, 15);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(carte);
L.marker(ECOLE).addTo(carte).bindPopup("Campus ESGI Aix-en-Provence");
L.control.zoom({ position: "bottomright" }).addTo(carte);

window.addEventListener("resize", () => carte.invalidateSize());
let cercle = null;

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
}

async function chargerParkings() {
  const reponse = await fetch("/parkings.json");
  const data = await reponse.json();

  data.parkings.forEach((p) => {
    L.marker(p.lat_long)
      .addTo(carte)
      .bindPopup(
        `<strong>${p.nom}</strong><br>${p.tarif}<br>${p.nombre_places} places`,
      );
  });
}

curseur.addEventListener("input", updateLabel);
updateLabel();
chargerParkings();
