# Installazione e Deploy

## Prerequisiti

- **Git** — per clonare il repository
- **Browser moderno** — Chrome 80+, Firefox 75+, Safari 13+
- **Node.js** — solo per lo script di build pre-deploy (`inject-date.js`); non serve per sviluppo locale
- **Python 3** — solo se usi il server locale con `http.server`

## Sviluppo locale

```bash
git clone https://github.com/mattiaboero/storiesociali.git
cd storiesociali
python3 -m http.server 8080
```

Apri `http://localhost:8080`.

> **Service Worker:** si registra solo su HTTPS o `localhost`. Su altri hostname locali (es. `192.168.x.x`) il SW non si attiva e le funzionalità offline non saranno disponibili. Questo è comportamento atteso del browser, non un bug.

In alternativa a Python, qualsiasi server statico funziona:

```bash
# Con Node.js
npx serve .

# Con PHP
php -S localhost:8080
```

## Struttura del repository

Il progetto non ha un build step per la sviluppo — i file serviti sono gli stessi presenti nella root. L'unico script da eseguire è `inject-date.js`, che modifica `index.html` e `sitemap.xml` prima del deploy per aggiornare le date.

## Deploy su Cloudflare Pages

### Configurazione

| Parametro | Valore |
|---|---|
| Repository | `github.com/mattiaboero/storiesociali` |
| Branch produzione | `main` |
| Build command | `node scripts/inject-date.js` |
| Build output directory | `.` (root del repository) |

### Cosa fa `inject-date.js`

Lo script aggiorna due valori prima del deploy:

1. **`dateModified`** in tutti i blocchi JSON-LD di `index.html` — mantiene aggiornato il segnale di freschezza per Google
2. **`<lastmod>`** in `sitemap.xml` — aggiorna tutte le URL nella sitemap

Il deploy si triggera automaticamente ad ogni merge su `main`.

### Cache headers

I Cache-Control sono definiti in `_headers`. In sintesi:

| Risorsa | Cache |
|---|---|
| `index.html`, `styles.css`, `app.js`, `sw.js` | `max-age=0, must-revalidate` |
| `/assets/*`, `/assets/fonts/*` | `max-age=31536000, immutable` |
| Pagine HTML interne | `max-age=300, stale-while-revalidate=3600` |

`app.js` e `styles.css` hanno cache zero per garantire che gli utenti ricevano sempre la versione aggiornata senza dover svuotare la cache del browser.

### CACHE_VERSION nel Service Worker

Ogni modifica rilevante richiede di aggiornare manualmente la variabile `CACHE_VERSION` in `sw.js`:

```js
const CACHE_VERSION = 'storiesociali-v20260430b';
```

Cambiare questa stringa invalida la cache precedente nell'evento `activate` del SW. Se non viene aggiornata, gli utenti con la versione vecchia in cache potrebbero non ricevere le modifiche.

## Verifica post-deploy

Dopo ogni deploy verificare:

1. Homepage carica e mostra l'anteprima vuota del wizard
2. Navigazione wizard completa (step 1 → 7) senza errori console
3. Salvataggio e riapertura di una storia dall'archivio
4. Export stampa (`Ctrl+P`) con layout corretto
5. Export PDF con font Lora e accenti italiani corretti
6. Pagine informative accessibili: `/chi-siamo/`, `/privacy/`, `/cookie/`, `/note-legali/`
7. Service worker attivo (`DevTools > Application > Service Workers`)
8. `DevTools > Application > Cache Storage` — verificare presenza del nuovo CACHE_VERSION
