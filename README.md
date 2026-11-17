# RCE Informatique — site développeur

Site statique servant de « site web » du compte développeur Google Play.

## Mise en ligne

1. Pousser le repo sur GitHub (`CharnaceRegis/rce-informatique`).
2. Settings → Pages → Source : **GitHub Actions**.
3. Chaque push sur `main` reconstruit et déploie le site.

URL de la politique de confidentialité (à saisir dans la Play Console) :
https://charnaceregis.github.io/rce-informatique/privacy.html
(version anglaise : https://charnaceregis.github.io/rce-informatique/en/privacy.html)

## Modifier le contenu

- Les infos variables (marque, responsable, SIREN, email, accroche FR/EN, date) sont dans `config.json`.
- Changer `lastUpdated` (format `AAAA-MM-JJ`) à chaque modification de la politique.
- Les textes des pages sont dans `build.mjs` (objet `content`).
- Un `TODO` dans `config.json` est signalé au build.
- Aperçu local : `node build.mjs` puis ouvrir `dist/index.html`.
