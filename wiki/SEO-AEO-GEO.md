# SEO, AEO e GEO

## SEO tecnico

### Metadata in `index.html`

| Elemento | Valore / Note |
|---|---|
| `<title>` | "Generatore di Storie Sociali in Italiano \| storiesociali.org" |
| `<meta description>` | ~155 caratteri, include keyword primarie |
| `canonical` | `https://storiesociali.org/` — presente su tutte le pagine |
| `hreflang` | `it-IT` + `x-default` su home e pagine interne |
| `robots` | `index, follow, max-snippet:-1, max-image-preview:large` |
| Open Graph | `og:title`, `og:description`, `og:url`, `og:image` (1200×630), `og:locale` |
| Twitter Card | `summary_large_image` con stessi campi OG |
| `theme-color` | `#C4622D` (brand arancione) |
| `apple-touch-icon` | `/assets/icon-192.png` |

### Dati strutturati JSON-LD

Tutti i nodi sono in un `@graph` unico in `index.html`:

| Tipo | ID | Scopo |
|---|---|---|
| `Organization` | `/#organization` | Entità publisher con indirizzo Torino |
| `WebSite` | `/#website` | Sitelink search box (potentialAction: CreateAction) |
| `WebPage` | `/#webpage` | Metadata pagina con author Person |
| `SoftwareApplication` | `/#app` | Rich snippet app con featureList, screenshot, Offer gratis |
| `HowTo` | `/#howto` | Procedura in 7 step — mostra rich snippet How-to in SERP |
| `FAQPage` | `/#faq` | 4 domande con acceptedAnswer — rich snippet FAQ |

Le pagine interne hanno ciascuna un `WebPage` + `BreadcrumbList`.
`chi-siamo/` ha anche `Organization` + `Person` (Mattia Boero con sameAs LinkedIn).

### Aggiornamento automatico date

Lo script `scripts/inject-date.js` aggiorna a ogni deploy:
- `"dateModified"` in tutti i blocchi JSON-LD di `index.html`
- `<lastmod>` in tutte le `<url>` di `sitemap.xml`

### Struttura heading

La home ha una sola `<h1>` ("Generatore di Storie Sociali in Italiano"). I 5 titoli dell'articolo SEO usano `<h2>`. Le domande del wizard usano `<p role="heading" aria-level="3">` — non `<h2>` — per evitare che Google legga i 7 heading nascosti come parte della struttura semantica.

## AEO — Answer Engine Optimization

### Paragrafo definitorio

Il primo contenuto dopo `<h1>` è un paragrafo `<p class="seo-definition">` che risponde direttamente alla query "cos'è una storia sociale". Questo è il testo che Google SGE, Perplexity e altri motori di risposta estraggono come definizione.

### FAQ HTML allineata con JSON-LD

La sezione `#faq-storie-sociali` usa `<details>/<summary>` — struttura semantica che segnala question/answer ai parser AEO. Le domande nell'HTML devono corrispondere esattamente alle `Question` nel JSON-LD `FAQPage`. Se si aggiunge o modifica una domanda, va aggiornata in entrambi i punti.

### Come aggiungere una domanda FAQ

1. Aggiungere `<details><summary>Domanda?</summary><p>Risposta.</p></details>` nella sezione `#faq-storie-sociali` di `index.html`
2. Aggiungere il blocco `{"@type": "Question", "name": "...", "acceptedAnswer": {...}}` nel `mainEntity` della `FAQPage` JSON-LD

## GEO — Generative Engine Optimization

### llms.txt

Il file `llms.txt` in root segue la specifica [llms-txt.org](https://llms-txt.org). Fornisce a sistemi AI (ChatGPT, Claude, Gemini, Perplexity) il contesto necessario per citare correttamente il sito:

- Definizione canonica di "storia sociale" e del metodo Carol Gray
- I quattro tipi di frase con descrizione e rapporto consigliato
- Elenco funzionalità precise
- Pubblico target (insegnanti, logopedisti, terapisti ABA, genitori)
- Limiti del sistema (non produce diagnosi, non sostituisce il giudizio professionale)
- Preferenze di citazione (forma breve, forma estesa, cosa non parafrasare)

Il link al file è nell'head di `index.html`:
```html
<link rel="alternate" type="text/plain" href="https://storiesociali.org/llms.txt">
```

### Entity consistency

Il nome "storiesociali.org" appare in modo coerente in: `<title>`, `og:site_name`, JSON-LD `Organization.name`, `llms.txt`, `chi-siamo/index.html`. Questa coerenza aiuta i sistemi AI a costruire un'entità stabile associata al dominio.

### Autore verificabile

`chi-siamo/index.html` ha un JSON-LD `Person` con `name: "Mattia Boero"`, `jobTitle`, `url` e `sameAs: ["https://www.linkedin.com/in/mattiaboero/", "https://github.com/mattiaboero"]`. Questo rende l'autore verificabile attraverso profili pubblici esistenti — un segnale di autorevolezza per i sistemi generativi.

### IndexNow

`scripts/indexnow-submit.mjs` notifica Bing (e indirettamente altri motori che supportano IndexNow) ad ogni deploy. Il token è in `indexnow-2f7cb2b59b2b4e9ca0f4fba5f8d89a4c.txt` nella root. La riga `Disallow: /indexnow-` in `robots.txt` nasconde il file ai crawler senza bloccare la funzionalità.
