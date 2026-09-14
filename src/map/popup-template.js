// popup-template.js
// Construit le HTML de la popup Leaflet pour un emplacement de stationnement.
// p doit avoir le format d'une entrée de parkings.json (voir A03).

function popupTemplate(p) {
  const prixTexte = p.prix_2h === 0 ? "Gratuit" : `${p.prix_2h.toFixed(2).replace(".00", "")} € / 2h`;

  const photoHtml = p.photo
    ? `<img class="parking-card__photo" src="${p.photo}" alt="${p.nom}">`
    : `<div class="parking-card__photo parking-card__photo--placeholder">Pas de photo</div>`;

  return `
    <div class="parking-card">
      ${photoHtml}
      <div class="parking-card__body">
        <p class="parking-card__title">${p.nom}</p>
        <span class="parking-card__type">${p.type}</span>

        <div class="parking-card__row">
          <span class="icon">💶</span><span>${prixTexte}</span>
        </div>
        <div class="parking-card__row">
          <span class="icon">⏱️</span><span>Durée max : ${p.duree_max}</span>
        </div>
        <div class="parking-card__row">
          <span class="icon">🚶</span><span>${p.distance_metres} m de l'école</span>
        </div>

        <div class="parking-card__badges">
          ${p.pmr ? '<span class="parking-card__badge">♿ PMR</span>' : ''}
          ${p.ouvert_24h ? '<span class="parking-card__badge">🌙 24h/24</span>' : ''}
          ${p.abrite ? '<span class="parking-card__badge">🏠 Abrité</span>' : '<span class="parking-card__badge">☀️ Plein air</span>'}
        </div>
      </div>
    </div>
  `;
}
