// Identifiant anonyme du visiteur, généré une fois et gardé en localStorage.
// Sert uniquement au cooldown anti-spam côté serveur — aucun compte,
// aucune donnée personnelle.
function getClientId() {
  let id = localStorage.getItem("fys_client_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("fys_client_id", id);
  }
  return id;
}

const API_BASE = "api"; // relatif : /find-your-spot/api/ (proxy nginx -> fys-api)

async function fetchStatus(id) {
  const res = await fetch(`${API_BASE}/parkings/${id}/status`);
  if (!res.ok) return null;
  const data = await res.json();
  return data && data.status ? data : null;
}

async function fetchAllStatuses() {
  const res = await fetch(`${API_BASE}/parkings/status`);
  if (!res.ok) return {};
  return res.json();
}

async function reportStatus(id, status) {
  const res = await fetch(`${API_BASE}/parkings/${id}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Id": getClientId(),
    },
    body: JSON.stringify({ status }),
  });

  if (res.status === 429) {
    const data = await res.json();
    return { error: data.error || "Merci, signalement déjà pris en compte récemment." };
  }
  if (!res.ok) {
    return { error: "Le signalement n'a pas pu être envoyé." };
  }
  return res.json();
}

const STATUS_LABELS = {
  libre: { emoji: "🟢", label: "Beaucoup de places" },
  quelques: { emoji: "🟡", label: "Quelques places" },
  peu: { emoji: "🟠", label: "Très peu de places" },
  complet: { emoji: "🔴", label: "Complet" },
};

function minutesAgo(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  return Math.max(0, Math.round(diffMs / 60000));
}
