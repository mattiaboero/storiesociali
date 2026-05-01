# Changelog

Le modifiche rilevanti al progetto sono documentate qui, in ordine cronologico inverso.

---

## [Unreleased]

### In lavorazione
- Sezione "Esempi di storie sociali" in homepage (6 storie originali per situazioni frequenti)
- Espansione contenuto SEO articolo homepage a 1.000+ parole

---

## [v7] — 2026-04-30

### Added
- `scripts/inject-date.js` ora aggiorna anche tutti i `<lastmod>` in `sitemap.xml`
- File di documentazione repo: `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `SUPPORT`, `CHANGELOG`, `LICENSE`
- Wiki tecnica in `/wiki/` con 8 pagine (Architettura, Wizard, Deploy, SEO/AEO/GEO, Roadmap, FAQ, Manutenzione)
- Template GitHub: bug report, feature request, pull request

### Changed
- `affirmativePreset` radio: valori cambiati da frase completa a chiave breve (`preset_retry`, `preset_help`, `custom`) — disaccoppia UI da logica e protegge `localStorage` da modifiche future al copy
- `<meta name="author">` aggiornato a `"Mattia Boero"` in `index.html`
- JSON-LD `WebPage.author` aggiornato con `name`, `url` e `sameAs` (LinkedIn)
- `og:title` allineato al separatore pipe `|` usato nel `<title>`

### Fixed
- Google Fonts (`Lora` + `DM Sans`) non più render-blocking: `media="print"` + attivazione JS con token anti-race identico al pattern OpenDyslexic

---

## [v6] — 2026-04-30

### Added
- Autore verificabile in `chi-siamo/index.html`: nome, qualifica, LinkedIn, GitHub
- JSON-LD `Person` aggiornato in `chi-siamo` con `sameAs` LinkedIn e `knowsAbout`
- `aria-required="true"` su `situationInput` e `directiveInput`
- `aria-describedby="directiveWarning"` su `directiveInput`
- `aria-invalid` gestito dinamicamente da `updateDirectiveWarning()` in `app.js`
- Header e footer di navigazione su tutte le pagine interne (`chi-siamo`, `privacy`, `cookie`, `note-legali`)
- CTA "Nuova storia" sopra il testo SEO su viewport mobile (CSS `order: -1`)
- Logo con `.app-logo-domain` che mostra il dominio accanto al brand name

### Changed
- `operatingSystem: "Web"` rimosso da JSON-LD `SoftwareApplication` (valore non standard Schema.org)
- Aggiunto `applicationSubCategory: "Productivity"` e `browserRequirements`
- `--color-text-secondary`: `#7A6E62` → `#6B5F54` (rapporto contrasto ~4.7:1 su bianco, WCAG AA)
- `getSentenceWordLimit["3-5"]`: 10 → 8 (allineato all'hint UI "6-8 parole")
- Title tag uniformati con separatore `|` su tutte le pagine
- `llms.txt` espanso con definizioni canoniche, tipi di frase, pubblico target, limiti, preferenze di citazione

### Fixed
- `robots.txt`: rimossi glob `/*.css$` e `/*.js$` non supportati da Googlebot; aggiunto `Disallow: /indexnow-`
- `inject-date.js`: aggiorna ora anche `sitemap.xml` oltre a `index.html`

---

## [v5] — 2026-04-30

### Added
- `loadDyslexicFont()` in `app.js`: OpenDyslexic caricato on-demand solo quando l'utente seleziona quel font (rimosso `<link>` statico dall'head)
- `visualStateToken` anti-race in `applyVisualSettings()` per prevenire conflitti su selezioni rapide del font
- `scripts/inject-date.js` per aggiornamento automatico `dateModified` JSON-LD a ogni deploy
- `apple-touch-icon` aggiunto in `index.html`
- `featureList` e `screenshot` aggiunti al JSON-LD `SoftwareApplication`
- JSON-LD `HowTo` espanso a 7 step completi
- `link rel="alternate"` per `llms.txt` nell'head

### Changed
- `registerServiceWorker()` aggiunta e chiamata in `init()`
- SW `install`: separati `CRITICAL_ASSETS` da `OPTIONAL_ASSETS` (font TTF) — font usa `Promise.allSettled` per evitare install failure su 404
- Tema `theme--contrast`: sovrascrive ora anche `--color-primary` e variabili colore frasi
- Icona maskable dedicata (`icon-192-maskable.png`) separata dall'icona standard
- `BreadcrumbList` JSON-LD aggiunto alle pagine interne
- JSON-LD `FAQPage` espanso a 4 domande

### Fixed
- `normalizeSentence()`: rimossa la regex `replace(/[.]+/g, " ")` che distruggeva la punteggiatura interna alle frasi
- Font PDF locale (`lora-regular.ttf`) con fallback CDN — accenti italiani corretti nel PDF esportato

---

## [v4] — 2026-04-27 (baseline pre-launch)

### Added
- Wizard in 7 step con anteprima live
- Bilanciamento frasi secondo metodo Carol Gray
- Semplificazione lessicale assistita (pannello suggerimenti, non automatica)
- Export stampa (`window.print()` + `@media print`) e PDF (`jsPDF` on-demand)
- Salvataggio storie in `localStorage` senza backend
- Temi visivi: colorato, minimal, alto contrasto
- Font: Standard (Lora/DM Sans), OpenDyslexic, Maiuscolo
- PWA: `manifest.json`, `sw.js` (cache-first)
- Pagine informative: `chi-siamo`, `privacy`, `cookie`, `note-legali`
- JSON-LD completo: `Organization`, `WebSite`, `WebPage`, `SoftwareApplication`, `HowTo`, `FAQPage`
- `robots.txt`, `sitemap.xml`, `llms.txt`, IndexNow
- Security headers Cloudflare: CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`
- Skip link, `aria-live` su toast e step announcer, `scope="col"` in tabella

### Known issues at baseline (risolti nelle versioni successive)
- `display:none` sui radio input bloccava tastiera e screen reader
- Font PDF assente — accenti italiani non funzionanti nel PDF
- `normalizeSentence()` distruggeva la punteggiatura interna
- Service worker senza registrazione in `init()`
- Tema alto contrasto incompleto (non sovrascriveva `--color-primary`)
