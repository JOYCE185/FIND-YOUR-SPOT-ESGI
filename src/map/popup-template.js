// Script classique (pas de module) : la fonction est exposée globalement
// pour être appelée depuis main.js. Champs attendus, au format réel de
// parkings.json : nom, tarif (texte), distance_m, nombre_places, pmr,
// ouvert_24h, abrite, image.
function popupTemplate(p) {
  const estGratuit = /free|gratuit/i.test(p.tarif || "");
  const tarifTexte = estGratuit ? "Gratuit" : p.tarif || "Tarif non renseigné";

  const photoHtml = p.image
    ? `<img class="parking-card__photo" src="${p.image}" alt="${p.nom}">`
    : `<div class="parking-card__photo parking-card__photo--placeholder">Pas de photo</div>`;

  return `
    <div class="parking-card">
      ${photoHtml}
      <div class="parking-card__body">
        <p class="parking-card__title">${p.nom}</p>

        <div class="parking-card__row">
          <span class="icon">💶</span><span>${tarifTexte}</span>
        </div>
        <div class="parking-card__row">
          <span class="icon">🅿️</span><span>${p.nombre_places} places</span>
        </div>
        <div class="parking-card__row">
          <span class="icon">🚶</span><span>${p.distance_m} m de l'école</span>
        </div>

        <div class="parking-card__badges">
          ${p.pmr ? '<span class="parking-card__badge">♿ PMR</span>' : ""}
          ${p.ouvert_24h ? '<span class="parking-card__badge">🌙 24h/24</span>' : ""}
          ${p.abrite ? '<span class="parking-card__badge">🏠 Abrité</span>' : '<span class="parking-card__badge">☀️ Plein air</span>'}
        </div>
      </div>
    </div>
  `;
}
