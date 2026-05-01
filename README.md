# storiesociali.org — Generatore di Storie Sociali in Italiano

Web app gratuita per creare **storie sociali in italiano**, costruita seguendo il metodo di Carol Gray. Pensata per insegnanti di sostegno, logopedisti, terapisti ABA, educatori e famiglie che lavorano con bambini con autismo o difficoltà di comprensione sociale.

🌐 **[storiesociali.org](https://storiesociali.org)**

---

## Cos'è una storia sociale

Una storia sociale è un testo breve strutturato che descrive una situazione quotidiana in modo concreto e prevedibile, per aiutare il bambino a capire cosa succede e come comportarsi. Il metodo, sviluppato da Carol Gray negli anni '90, prevede quattro tipi di frase: **descrittiva** (fatti oggettivi), **prospettica** (emozioni degli altri), **direttiva** (azione possibile, sempre in forma gentile), **affermativa** (rinforzo positivo conclusivo). Il rapporto consigliato è 2-5 frasi descrittive per ogni frase direttiva.

## Cosa fa il generatore

Il wizard guida la scrittura in 7 passaggi:

1. **Protagonista** — prima o terza persona, nome, fascia d'età (3-5 / 6-8 / 9-12 anni). Il lessico si adatta automaticamente.
2. **Situazione** — descrizione libera o selezione da esempi rapidi.
3. **Contesto descrittivo** — dove, quando, chi c'è, cosa fanno gli altri.
4. **Prospettiva** — come si sentono le persone presenti.
5. **Azione direttiva** — con controllo in tempo reale che la frase inizi con _Posso_, _Proverò a_ o _Potrei_.
6. **Rinforzo affermativo** — preset o personalizzato.
7. **Stile e export** — font (Standard / OpenDyslexic / Maiuscolo), tema visivo (colorato / minimal / alto contrasto), spazio immagini, salvataggio, copia, stampa, PDF.

L'anteprima si aggiorna live ad ogni modifica. Il pannello di bilanciamento segnala se il rapporto tra tipi di frase rispetta la struttura Carol Gray. Il pannello lessicale segnala parole complesse e suggerisce sostituzioni, senza modificare il testo in modo automatico.

## A chi serve

| Ruolo | Uso tipico |
|---|---|
| Insegnante di sostegno | Preparare situazioni nuove: gita, mensa, ricreazione |
| Logopedista / terapista ABA | Creare materiali personalizzati per il singolo bambino |
| Educatore | Strutturare regole sociali implicite in formato comprensibile |
| Genitore | Spiegare eventi ansiogeni: visita medica, viaggio, cambio routine |

## Caratteristiche tecniche principali

- **Nessun account, nessun backend.** Le storie vengono salvate in `localStorage` sul dispositivo dell'utente. Nessun dato viene trasmesso a server esterni.
- **PWA installabile.** Service worker con strategia cache-first per uso offline.
- **Accessibilità WCAG 2.1 AA.** Skip link, `aria-live`, `aria-required`, `aria-invalid`, navigazione completa da tastiera, alto contrasto, OpenDyslexic.
- **Font a caricamento lazy.** OpenDyslexic viene scaricato solo quando l'utente lo seleziona. Google Fonts usa `media="print"` con attivazione JS per evitare il blocco del rendering.
- **Export PDF con font embedding.** Lora Regular viene incorporato nel PDF via base64 per garantire la corretta codifica degli accenti italiani.
- **SEO/AEO/GEO completo.** JSON-LD con 6 nodi (`Organization`, `WebSite`, `WebPage`, `SoftwareApplication`, `HowTo`, `FAQPage`), `llms.txt`, `IndexNow`.

## Stack

```
HTML5 · CSS3 · JavaScript vanilla
jsPDF (on-demand)
window.print() + @media print
Service Worker (PWA)
Cloudflare Pages (hosting + CDN + headers)
```

Nessun framework, nessun bundler in produzione. Il build step è un singolo script Node.js.

## Avvio locale

```bash
git clone https://github.com/mattiaboero/storiesociali.git
cd storiesociali
python3 -m http.server 8080
```

Apri `http://localhost:8080`. Non serve Node.js per la sviluppo locale — serve solo per lo script di deploy.

> Il service worker si registra solo su HTTPS o `localhost`. Su altri hostname locali le funzionalità offline non saranno attive.

## Deploy su Cloudflare Pages

| Parametro | Valore |
|---|---|
| Branch produzione | `main` |
| Build command | `node scripts/inject-date.js` |
| Build output directory | `.` (root) |

Lo script `inject-date.js` aggiorna automaticamente `dateModified` nei blocchi JSON-LD e `lastmod` in `sitemap.xml` prima di ogni deploy.

## Struttura del progetto

```
storiesociali/
├── index.html              # App principale + metadata SEO + JSON-LD
├── app.js                  # Wizard, state, preview, export (vanilla JS)
├── styles.css              # Design system, layout, print, temi, PWA
├── sw.js                   # Service worker — cache-first, font opzionale
├── manifest.json           # PWA manifest
├── _headers                # Security + Cache-Control headers Cloudflare
├── robots.txt              # Crawling policy + Disallow IndexNow token
├── sitemap.xml             # URL canonici con lastmod auto-aggiornato
├── llms.txt                # AI/LLM context file (GEO readiness)
├── favicon.ico / assets/   # Icone, OG image, font PDF
├── scripts/
│   ├── inject-date.js      # Aggiorna dateModified e sitemap lastmod
│   └── indexnow-submit.mjs # Notifica IndexNow ad ogni deploy
├── chi-siamo/              # Profilo progetto + autore (JSON-LD Person)
├── privacy/                # Informativa GDPR
├── cookie/                 # Cookie policy
└── note-legali/            # Note legali
```

## Documentazione

- [Contribuire al progetto](CONTRIBUTING.md)
- [Codice di condotta](CODE_OF_CONDUCT.md)
- [Segnalare vulnerabilità](SECURITY.md)
- [Supporto](SUPPORT.md)
- [Wiki tecnica](wiki/Home.md)
  - [Architettura tecnica](wiki/Architettura-Tecnica.md)
  - [Guida al wizard](wiki/Guida-Wizard.md)
  - [Installazione e deploy](wiki/Installazione-e-Deploy.md)
  - [SEO, AEO e GEO](wiki/SEO-AEO-GEO.md)
  - [Manutenzione e rilascio](wiki/Manutenzione-e-Rilascio.md)
  - [FAQ tecniche](wiki/FAQ-Tecniche.md)
  - [Roadmap](wiki/Roadmap.md)

## Licenza

MIT — vedi [LICENSE](LICENSE.md).

---

Progetto sviluppato da [Mattia Boero](https://storiesociali.org/chi-siamo/) · Torino, Italia.
