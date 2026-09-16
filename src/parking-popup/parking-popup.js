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

        ${liveStatusHtml(p)}
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
// Bloc "en direct" : statut signalé par les autres visiteurs (ou son
// absence), plus les boutons pour signaler la situation actuelle.
// p.liveStatus est rempli par main.js après appel à l'API ; peut être
// null si personne n'a rien signalé récemment (ou API indisponible).

function liveStatusHtml(p) {
  const s = p.liveStatus;

  const etatHtml = s
    ? `<span class="live-status__badge">${STATUS_LABELS[s.status].emoji} ${STATUS_LABELS[s.status].label}</span>
       <span class="live-status__age">il y a ${minutesAgo(s.updatedAt)} min · ${s.reportsCount} signalement${s.reportsCount > 1 ? "s" : ""}</span>`
    : `<span class="live-status__badge live-status__badge--unknown">⚪ Disponibilité inconnue</span>
       <span class="live-status__age">Sois le premier à signaler</span>`;

  return `
    <div class="live-status" data-parking-id="${p.id}">
      <p class="live-status__title">En direct</p>
      <div class="live-status__current">${etatHtml}</div>
      <div class="live-status__actions">
        <button type="button" class="live-status__btn" data-status="libre" onclick="handleReport('${p.id}', 'libre')">🟢 Libre</button>
        <button type="button" class="live-status__btn" data-status="quelques" onclick="handleReport('${p.id}', 'quelques')">🟡 Quelques</button>
        <button type="button" class="live-status__btn" data-status="peu" onclick="handleReport('${p.id}', 'peu')">🟠 Peu</button>
        <button type="button" class="live-status__btn" data-status="complet" onclick="handleReport('${p.id}', 'complet')">🔴 Complet</button>
      </div>
      <p class="live-status__feedback" data-feedback></p>
    </div>
  `;
}
