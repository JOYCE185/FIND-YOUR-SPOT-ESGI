# Carte des parkings autour de l'école — G01

Une carte interactive qui recense les possibilités de stationnement autour de l'école, pour que les étudiants qui viennent en voiture ou en deux-roues arrêtent de tourner dix minutes avant un cours.

L'information existe déjà, mais elle est éparpillée : panneaux sur place, applications de paiement, zones bleues mal signalées, parkings dont les tarifs ne sont affichés nulle part. On l'a relevée à pied et rassemblée au même endroit.

## Ce que fait le site

Une carte affiche chaque emplacement relevé. Un clic ouvre sa fiche : type de stationnement, tarif, durée maximale, horaires, distance à pied jusqu'à l'école.

Les emplacements se trient et se filtrent selon cinq critères :

- **Prix** — du gratuit au plus cher
- **Distance à pied** jusqu'à l'école
- **Place handicapée** disponible
- **Ouverture 24h/24**
- **Abrité** ou en plein air

Pas de compte à créer, pas d'installation. On ouvre le lien et on s'en sert.

## Comment c'est fait

HTML, CSS et JavaScript, sans framework. La carte utilise la librairie javascript Leaflet. Les données sont dans un fichier `parkings.json` versionné avec le code.

Le site est servi en fichiers statiques depuis un VPS administré par l'équipe.

## Visiter le site

[a link](https://samex-amenagement.fr/find-your-spot/)

## L'équipe

| Nom            | Promo | Domaine             |
| -------------- | ----- | ------------------- |
| Thomas TEBOUL  | A2    | Développement       |
| Joyce BIOULE   | A1    | Développement       |
| Leny CAMUS     | A2    | Systèmes et réseaux |
| Tristan LURON  | A1    | Cybersécurité       |
| Kong HELLEQUIN | A1    | Data et IA          |

Projet réalisé pendant le séminaire de prérentrée du 14 au 18 septembre 2026.
