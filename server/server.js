import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "redis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 3001);
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5500";
const REPORT_TTL_SECONDS = Number(process.env.REPORT_TTL_SECONDS || 1800);
const COOLDOWN_SECONDS = Number(process.env.COOLDOWN_SECONDS || 60);

// Statuts autorisés — volontairement qualitatifs, pas de nombre exact.
// Un champ libre serait trivial à falsifier ("9999 places libres").
const VALID_STATUSES = ["libre", "quelques", "peu", "complet"];

// ---- Charge la liste des parkings connus (pour valider les :id reçus) ----
const parkingsPath = path.join(__dirname, "..", "parkings.json");
const parkingsFile = JSON.parse(fs.readFileSync(parkingsPath, "utf-8"));
const VALID_IDS = new Set(parkingsFile.parkings.map((p) => p.id));

// ---------------------------------------------------------------------

const redis = createClient({ url: REDIS_URL });
redis.on("error", (err) => console.error("Redis error:", err));
await redis.connect();

const app = express();
app.set("trust proxy", 1); // derrière nginx

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: "2kb" })); // payload volontairement minuscule

// Rate limit global par IP : protège contre un script qui bombarde l'API
// sans passer par le navigateur (le cooldown par clientId ne suffit pas
// à lui seul, un clientId se régénère en vidant le localStorage).
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez dans une minute." },
});
app.use("/api/", globalLimiter);

function keyStatus(id) {
  return `parking:${id}:status`;
}
function keyCooldown(clientId, id) {
  return `cooldown:${clientId}:${id}`;
}

// ---- GET /api/parkings/status : statut en direct de tous les parkings ----
app.get("/api/parkings/status", async (req, res) => {
  const ids = [...VALID_IDS];
  const multi = redis.multi();
  ids.forEach((id) => multi.hGetAll(keyStatus(id)));
  const results = await multi.exec();

  const out = {};
  ids.forEach((id, i) => {
    const r = results[i];
    out[id] = r && r.status ? r : null; // null = pas de signalement récent
  });

  res.json(out);
});

// ---- GET /api/parkings/:id/status : statut d'un seul parking ----
app.get("/api/parkings/:id/status", async (req, res) => {
  const { id } = req.params;
  if (!VALID_IDS.has(id)) {
    return res.status(404).json({ error: "Parking inconnu." });
  }
  const data = await redis.hGetAll(keyStatus(id));
  res.json(data && data.status ? data : null);
});

// ---- POST /api/parkings/:id/report : signalement d'un visiteur ----
app.post("/api/parkings/:id/report", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const clientId = req.get("X-Client-Id");

  if (!VALID_IDS.has(id)) {
    return res.status(404).json({ error: "Parking inconnu." });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
  }
  if (!clientId || typeof clientId !== "string" || clientId.length > 100) {
    return res.status(400).json({ error: "Identifiant client manquant." });
  }

  // Anti-spam : un même visiteur ne peut re-signaler ce parking
  // qu'après COOLDOWN_SECONDS. SET ... NX pose la clé seulement si elle
  // n'existe pas encore, donc si ça échoue, il est dans son cooldown.
  const cdKey = keyCooldown(clientId, id);
  const acquired = await redis.set(cdKey, "1", {
    NX: true,
    EX: COOLDOWN_SECONDS,
  });
  if (!acquired) {
    const ttl = await redis.ttl(cdKey);
    return res.status(429).json({
      error: "Merci, on a déjà ton signalement récent pour ce parking.",
      retryAfterSeconds: ttl,
    });
  }

  const now = new Date().toISOString();
  const statusKey = keyStatus(id);

  await redis
    .multi()
    .hSet(statusKey, { status, updatedAt: now })
    .hIncrBy(statusKey, "reportsCount", 1)
    .expire(statusKey, REPORT_TTL_SECONDS) // TTL renouvelé à chaque signalement
    .exec();

  const updated = await redis.hGetAll(statusKey);
  res.status(201).json(updated);
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API Find Your Spot en écoute sur le port ${PORT}`);
});
