# Architettura Tecnica

## Panoramica

storiesociali.org è una **single-page application statica** senza backend. Tutto gira nel browser. Non ci sono API server, database o sessioni. L'unico storage è `localStorage` del browser dell'utente.

Il deploy è su Cloudflare Pages, che gestisce CDN, HTTPS, HTTP/2 e i response header definiti in `_headers`.

## File principali

| File | Ruolo |
|---|---|
| `index.html` | Struttura app, metadata SEO, JSON-LD, wizard HTML, article SEO, footer |
| `app.js` | Tutta la logica: state, wizard, preview, bilanciamento, lessico, export |
| `styles.css` | Design system (custom properties), layout, componenti, temi, print |
| `sw.js` | Service worker: strategia cache-first, gestione asset offline |
| `manifest.json` | PWA manifest: icone, colori, display mode |
| `_headers` | Security headers e Cache-Control per Cloudflare Pages |

## State management

L'intera app gira su un singolo oggetto `state` globale:

```js
state = {
  currentStep: 1,
  form: {
    protagonistType,   // "personal" | "generic"
    protagonistName,
    ageRange,          // "3-5" | "6-8" | "9-12"
    situation,
    where, when, who, whatOthers,
    perspective, perspectiveExtra,
    directive,
    affirmativePreset, // "preset_retry" | "preset_help" | "custom"
    affirmativeCustom,
    storyTitle,
    visualStyle,       // "minimal" | "colorful" | "high-contrast"
    imageSpace,        // "none" | "small" | "large"
    fontChoice,        // "standard" | "dyslexic" | "uppercase"
  },
  stories: []          // array storie salvate in localStorage
}
```

Gli input del wizard leggono e scrivono `state.form` via `handleInput()`. `updatePreviewAndGuidance()` viene chiamata ad ogni cambiamento e triggera `buildStory()` → `renderPreview()`.

## Pipeline di costruzione della storia

```
state.form
  └─ buildStory()
       ├─ buildDescriptiveSentence()   → frase descrittiva (dove + quando + chi + cosa)
       ├─ buildPerspectiveSentence()   → frase prospettica
       ├─ buildPerspectiveExtraSentence()
       ├─ buildDirectiveSentence()     → frase direttiva (controlla start Posso/Proverò/Potrei)
       └─ buildAffirmativeSentence()   → frase affermativa (preset o custom)
       → { sentences[], balance{}, counts{} }

renderPreview(story)  → DOM .sentences con .sentence-type-bar[data-type] per colore
renderBalance(...)    → pannello .balanceStatus
renderLexicalWarnings() → pannello .lexicalWarnings
```

`normalizeSentence(text, maxWords)` pulisce e tronca ogni frase prodotta. Rimuove solo la punteggiatura finale prima di aggiungere il punto; preserva la punteggiatura interna.

`getSentenceWordLimit()` restituisce 8 / 11 / 12 parole per le tre fasce d'età.

## Bilanciamento Carol Gray

`evaluateBalance(counts)` controlla che il numero di frasi descrittive sia almeno il doppio del numero di frasi direttive. Se il rapporto non è rispettato, mostra un warning nel pannello `.balanceStatus`.

## Semplificazione lessicale

`collectLexicalSuggestions()` scansiona il testo di ogni frase contro una lista `SOSTITUZIONI_ORDINATE` di coppie (termine complesso → alternativa semplice). I risultati sono mostrati nel pannello `.lexicalWarnings` come suggerimenti — non vengono mai applicati automaticamente al testo.

## Export

**Stampa:** `window.print()` + foglio di stile `@media print` in `styles.css`. Il layout si adatta automaticamente al foglio A4 con interlinea aumentata.

**PDF:** `jsPDF` viene caricato on-demand da jsdelivr solo quando l'utente clicca "Scarica PDF". Il font `Lora-Regular.ttf` viene caricato in base64 (prima dal path locale `/assets/fonts/`, poi da CDN come fallback) e incorporato nel PDF per garantire la corretta codifica degli accenti italiani. Helvetica non supporta il charset latino esteso.

```js
const PDF_FONT_URLS = [
  '/assets/fonts/lora-regular.ttf',
  'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/lora/Lora-Regular.ttf'
];
```

## Font loading

**Lora + DM Sans (Google Fonts):** il `<link rel="stylesheet">` usa `media="print"` per evitare il blocco del rendering. L'attivazione avviene via JS (`link.media = 'all'`) con un token anti-race che previene conflitti su navigazioni rapide.

**OpenDyslexic (cdnfonts.com):** caricato on-demand da `loadDyslexicFont()` solo quando l'utente seleziona quel font allo step 7. La funzione gestisce il caso in cui il `<link>` esista già nel DOM (navigazione avanti/indietro tra step) senza duplicati.

## PWA e Service Worker

Il service worker usa una strategia **cache-first** per tutte le risorse:

- **Install:** pre-cacha `CRITICAL_ASSETS` (HTML, CSS, JS, icone, pagine) con `cache.addAll` atomico. Il font TTF è in `OPTIONAL_ASSETS` con `Promise.allSettled` — un errore sul font non blocca l'install.
- **Fetch:** risposta dalla cache se disponibile; altrimenti fetch dalla rete con aggiornamento della cache.
- **Activate:** elimina cache con versione precedente (`CACHE_VERSION`).

Ogni modifica rilevante richiede aggiornamento manuale di `CACHE_VERSION` in `sw.js`.

## Security headers (`_headers`)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com;
  font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com data:;
  img-src 'self' data: https:;
  connect-src 'self' https://api.indexnow.org https://cdn.jsdelivr.net;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  form-action 'self'
```

`fonts.cdnfonts.com` è in `style-src` e `font-src` perché OpenDyslexic viene iniettato dinamicamente come `<link rel="stylesheet">` — questa è una richiesta di tipo stylesheet, non `connect-src`.

## Temi visivi

Tre temi CSS applicati come classi su `<body>`:

- `.theme--colorful` — default con colori brand e barre frase tipizzate
- `.theme--minimal` — sfondo bianco, colori ridotti
- `.theme--contrast` — sovrascrive tutte le variabili colore per alto contrasto WCAG

I colori delle frasi sono definiti come custom properties:

```css
--color-descriptive: #4A7C6F;
--color-perspective: #7B6EA6;
--color-directive:   #C4622D;
--color-affirmative: #C8A84B;
```

## Persistenza localStorage

Ogni storia salvata è un JSON serializzato in `localStorage` con chiave `socialStories_v1`. Il payload contiene una copia completa di `state.form` al momento del salvataggio, più `id` (timestamp) e `savedAt`.
