function popupTemplate(p) {
  const estGratuit = p.tarif === 'Gratuit';
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

function schoolPopupTemplate() {
  return `
    <div class="parking-card">
      <img class="parking-card__photo" src="https://imgs.search.brave.com/Us3aRXMKbEtxbc0BNuqCjSyuSBGDX4RW_lA8IMjAAI0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZXNnaS5mci9fYXNz/ZXRzL3d3dy5lc2dp/LmZyL2Vjb2xlLWlu/Zm9ybWF0aXF1ZS9B/aXgtY2FtcHVzLTEu/cG5n" alt="Campus Skolae">
      <div class="parking-card__body">
        <p class="parking-card__title">Campus Skolae Aix-en-Provence</p>
      </div>
    </div>
  `;
}