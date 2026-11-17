// Génère le site statique dans ./dist à partir de config.json (aucune dépendance).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const cfg = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
const OUT = "dist";

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Un TODO laissé dans config.json doit se voir au build, pas seulement en ligne.
const todos = JSON.stringify(cfg).match(/TODO[^"]*/g);
if (todos) console.warn(`⚠ TODO dans config.json :\n  - ${todos.join("\n  - ")}`);

const PAGES = ["index", "privacy", "support"];
const t = {
  fr: {
    nav: { index: "Accueil", privacy: "Confidentialité", support: "Support" },
    other: "English",
    updated: "Dernière mise à jour",
    dateLocale: "fr-FR",
  },
  en: {
    nav: { index: "Home", privacy: "Privacy", support: "Support" },
    other: "Français",
    updated: "Last updated",
    dateLocale: "en-GB",
  },
};

const brand = esc(cfg.brand);
const owner = esc(cfg.owner);
const siren = esc(cfg.siren);
const email = esc(cfg.email);
const mail = `<a href="mailto:${email}">${email}</a>`;
const country = (lang) => esc(cfg.country[lang]);

const content = {
  fr: {
    index: {
      title: brand,
      desc: `${brand} — ${cfg.tagline.fr}`,
      body: `
<h1>${brand}</h1>
<p class="lead">${esc(cfg.tagline.fr)}</p>
<p>${brand} est l'activité de ${owner}, qui conçoit et publie des applications mobiles (Android) et web.</p>
<h2>Contact</h2>
<ul>
  <li>Email : ${mail}</li>
  <li>Responsable : ${owner}</li>
  <li>SIREN : ${siren}</li>
  <li>Pays : ${country("fr")}</li>
</ul>
<p>Voir aussi la <a href="privacy.html">politique de confidentialité</a> et la page <a href="support.html">support</a>.</p>`,
    },
    privacy: {
      title: `Politique de confidentialité — ${brand}`,
      desc: `Politique de confidentialité des applications publiées par ${brand}.`,
      body: `
<h1>Politique de confidentialité</h1>
<p>Cette politique s'applique à toutes les applications Android publiées par ${brand} sur Google Play.</p>
<h2>Responsable</h2>
<p>${owner}, ${brand}, SIREN ${siren}, ${country("fr")}. Contact : ${mail}.</p>
<h2>Données collectées</h2>
<p><strong>Aucune.</strong> Les applications ne collectent, ne transmettent et ne partagent aucune donnée personnelle. Elles n'intègrent ni outil de statistiques, ni rapport de plantage, ni publicité, ni géolocalisation, et ne demandent pas de créer de compte.</p>
<h2>Données locales sur l'appareil</h2>
<p>Les données que vous saisissez dans une application (réglages, contenus) sont enregistrées uniquement sur votre appareil. Elles ne sont jamais envoyées à ${brand} ni à un tiers.</p>
<p>Pour les supprimer : effacez les données de l'application (Paramètres Android → Applications → l'application → Stockage → Effacer les données) ou désinstallez-la. Aucune donnée n'étant conservée sur un serveur, rien d'autre n'est à supprimer.</p>
<h2>Permissions Android</h2>
<p>Si une application demande une permission Android, celle-ci sert uniquement à son fonctionnement sur l'appareil et n'entraîne aucune transmission de données. Vous pouvez la révoquer à tout moment dans les paramètres Android.</p>
<h2>Enfants</h2>
<p>Aucune donnée n'étant collectée, aucune donnée concernant des enfants n'est collectée.</p>
<h2>Modifications</h2>
<p>Cette politique peut être mise à jour. La date de dernière mise à jour figure en bas de page.</p>
<h2>Contact</h2>
<p>Pour toute question : ${mail}.</p>`,
    },
    support: {
      title: `Support — ${brand}`,
      desc: `Support des applications publiées par ${brand}.`,
      body: `
<h1>Support</h1>
<p>Pour signaler un problème ou poser une question, écrivez à ${mail}.</p>
<h2>Informations utiles</h2>
<p>Pour une réponse rapide, précisez :</p>
<ul>
  <li>le nom de l'application ;</li>
  <li>sa version (visible dans Google Play ou dans les paramètres de l'application) ;</li>
  <li>le modèle de votre téléphone ;</li>
  <li>la version d'Android ;</li>
  <li>une description du problème et, si possible, une capture d'écran.</li>
</ul>`,
    },
  },
  en: {
    index: {
      title: brand,
      desc: `${brand} — ${cfg.tagline.en}`,
      body: `
<h1>${brand}</h1>
<p class="lead">${esc(cfg.tagline.en)}</p>
<p>${brand} is the business of ${owner}, who designs and publishes mobile (Android) and web applications.</p>
<h2>Contact</h2>
<ul>
  <li>Email: ${mail}</li>
  <li>Owner: ${owner}</li>
  <li>SIREN: ${siren}</li>
  <li>Country: ${country("en")}</li>
</ul>
<p>See also the <a href="privacy.html">privacy policy</a> and the <a href="support.html">support</a> page.</p>`,
    },
    privacy: {
      title: `Privacy policy — ${brand}`,
      desc: `Privacy policy for the applications published by ${brand}.`,
      body: `
<h1>Privacy policy</h1>
<p>This policy applies to all Android applications published by ${brand} on Google Play.</p>
<h2>Controller</h2>
<p>${owner}, ${brand}, SIREN ${siren}, ${country("en")}. Contact: ${mail}.</p>
<h2>Data collected</h2>
<p><strong>None.</strong> The applications do not collect, transmit or share any personal data. They include no analytics, no crash reporting, no advertising, no location tracking, and require no account.</p>
<h2>Data stored on your device</h2>
<p>Data you enter in an application (settings, content) is stored only on your device. It is never sent to ${brand} or any third party.</p>
<p>To delete it: clear the app's data (Android Settings → Apps → the app → Storage → Clear data) or uninstall the app. Since no data is kept on any server, nothing else needs to be deleted.</p>
<h2>Android permissions</h2>
<p>If an application requests an Android permission, it is used only for the app to work on your device and never leads to data being transmitted. You can revoke it at any time in Android settings.</p>
<h2>Children</h2>
<p>Since no data is collected, no data about children is collected.</p>
<h2>Changes</h2>
<p>This policy may be updated. The last update date is shown at the bottom of the page.</p>
<h2>Contact</h2>
<p>For any question: ${mail}.</p>`,
    },
    support: {
      title: `Support — ${brand}`,
      desc: `Support for the applications published by ${brand}.`,
      body: `
<h1>Support</h1>
<p>To report a problem or ask a question, email ${mail}.</p>
<h2>Useful information</h2>
<p>For a quick answer, please include:</p>
<ul>
  <li>the application name;</li>
  <li>its version (shown in Google Play or in the app settings);</li>
  <li>your phone model;</li>
  <li>your Android version;</li>
  <li>a description of the problem and, if possible, a screenshot.</li>
</ul>`,
    },
  },
};

const CSS = `
:root{--bg:#fff;--fg:#1b1f24;--muted:#57606a;--accent:#0b5cad;--line:#d8dee4;--card:#f6f8fa}
@media (prefers-color-scheme:dark){:root{--bg:#0f1216;--fg:#e6edf3;--muted:#9aa5b1;--accent:#6cb6ff;--line:#30363d;--card:#161b22}}
*{box-sizing:border-box}
html{color-scheme:light dark}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:46rem;margin:0 auto;padding:0 16px}
header{border-bottom:1px solid var(--line);background:var(--card)}
header .wrap{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;align-items:center;padding-block:.75rem}
.brand{font-weight:700;color:var(--fg);text-decoration:none;margin-right:auto}
nav{display:flex;flex-wrap:wrap;gap:.25rem 1rem}
nav a,.lang{color:var(--accent);text-decoration:none}
nav a[aria-current=page]{color:var(--fg);font-weight:600}
nav a:hover,.lang:hover{text-decoration:underline}
main{padding-block:2rem}
h1{font-size:1.9rem;line-height:1.2;margin:0 0 1rem}
h2{font-size:1.2rem;margin:2rem 0 .5rem}
.lead{font-size:1.15rem;color:var(--muted)}
a{color:var(--accent);overflow-wrap:anywhere}
footer{border-top:1px solid var(--line);color:var(--muted);font-size:.9rem}
footer .wrap{padding-block:1.25rem}
`.replace(/\n/g, "");

function page(lang, name) {
  const L = t[lang];
  const other = lang === "fr" ? "en" : "fr";
  const c = content[lang][name];
  const file = `${name}.html`;
  const url = (l) => `${cfg.baseUrl}/${l === "en" ? "en/" : ""}${name === "index" ? "" : file}`;
  // Liens relatifs : le site vit sous /rce-informatique/, pas à la racine du domaine.
  const otherHref = lang === "fr" ? `en/${file}` : `../${file}`;
  const nav = PAGES.map(
    (p) => `<a href="${p}.html"${p === name ? ' aria-current="page"' : ""}>${L.nav[p]}</a>`
  ).join("");
  const date = new Date(`${cfg.lastUpdated}T00:00:00Z`).toLocaleDateString(L.dateLocale, {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title>
<meta name="description" content="${c.desc}">
<link rel="canonical" href="${url(lang)}">
<link rel="alternate" hreflang="fr" href="${url("fr")}">
<link rel="alternate" hreflang="en" href="${url("en")}">
<link rel="alternate" hreflang="x-default" href="${url("fr")}">
<style>${CSS}</style>
</head>
<body>
<header><div class="wrap">
<a class="brand" href="index.html">${brand}</a>
<nav>${nav}</nav>
<a class="lang" href="${otherHref}" hreflang="${other}" lang="${other}">${L.other}</a>
</div></header>
<main class="wrap">${c.body}
</main>
<footer><div class="wrap">© ${brand} — ${owner} — SIREN ${siren}<br>${L.updated}${lang === "fr" ? " :" : ":"} <time datetime="${esc(cfg.lastUpdated)}">${date}</time></div></footer>
</body>
</html>
`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "en"), { recursive: true });
writeFileSync(join(OUT, ".nojekyll"), "");
for (const lang of ["fr", "en"]) {
  for (const name of PAGES) {
    const path = join(OUT, lang === "en" ? "en" : "", `${name}.html`);
    writeFileSync(path, page(lang, name));
    console.log(`✓ ${path}`);
  }
}
