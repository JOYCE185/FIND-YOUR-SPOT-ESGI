# Déploiement de l'API (server/) — pour Leny

## 1. Installer Redis sur le VPS (si pas déjà fait)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable --now redis-server
```

Par défaut Redis écoute sur `127.0.0.1:6379`, donc pas besoin d'ouvrir de port
public — seule l'API locale y accède.

## 2. Installer et lancer l'API

```bash
cd FIND-YOUR-SPOT-ESGI/server
cp .env.example .env
# éditer .env : mettre ALLOWED_ORIGIN=https://<votre-domaine>
npm install
node server.js
```

Pour que l'API reste en vie après déconnexion du terminal, utiliser `pm2`
(ou un service systemd) plutôt que de la laisser tourner dans le terminal :

```bash
sudo npm install -g pm2
pm2 start server.js --name fys-api
pm2 save
pm2 startup   # affiche la commande à lancer pour démarrer pm2 au boot
```

## 3. Faire pointer nginx vers l'API

Le site reste 100% de fichiers statiques servis par nginx ; on ajoute juste
un bloc qui redirige `/api/...` vers le process Node local. À ajouter dans
le `server { ... }` HTTPS existant (celui de l'A16/A26/A28) :

```nginx
location /api/ {
    proxy_pass         http://127.0.0.1:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
}
```

Puis :

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Vérifier

```bash
curl https://<votre-domaine>/api/health
# -> {"ok":true}
```

## Notes

- `server/.env` ne doit jamais être commit (déjà couvert par `.gitignore`,
  voir section 7.2 du dossier de contexte : rien de sensible dans le dépôt).
- `PORT` de l'API (3001 par défaut) n'a pas besoin d'être exposé publiquement,
  nginx est le seul point d'entrée.
- Si le VPS devient indisponible (risque déjà identifié dans le dossier de
  contexte), le site statique retombe sur l'hébergement de secours mais la
  partie signalement en direct sera simplement indisponible — les popups
  affichent alors "Disponibilité inconnue" au lieu de planter.
