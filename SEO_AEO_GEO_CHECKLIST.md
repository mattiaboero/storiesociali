# Implementazione SEO / AEO / GEO - storiesociali.org

Ultimo aggiornamento: 2026-04-27

## Già implementato in codice

- Meta base SEO (`title`, `description`, `robots`, `canonical`, `hreflang`) su home.
- Open Graph e Twitter card su home e pagine trust.
- JSON-LD in home con:
  - `Organization`
  - `WebSite`
  - `WebPage`
  - `SoftwareApplication`
  - `HowTo`
  - `FAQPage`
  - `BreadcrumbList`
- Struttura AEO in homepage:
  - lead paragraph con risposta diretta
  - indice interno
  - sezioni H2 orientate a intent
  - FAQ visibile in HTML
  - sezione fonti con entity linking
- Pagine trust create:
  - `/chi-siamo/`
  - `/privacy/`
  - `/cookie/`
  - `/note-legali/`
- File tecnici creati:
  - `/robots.txt`
  - `/sitemap.xml`
  - `/llms.txt`
  - `/_headers` (security headers per host compatibili)
- Asset metadata:
  - `/assets/logo-storiesociali.svg`
  - `/assets/og-storie-sociali.png`
- IndexNow:
  - chiave pubblica in root (`indexnow-...txt`)
  - script invio: `scripts/indexnow-submit.mjs`

## Azioni manuali da completare (fuori codice)

1. Verifica dominio su Google Search Console.
2. Invia `https://storiesociali.org/sitemap.xml` a GSC.
3. Verifica dominio su Bing Webmaster Tools.
4. Invia sitemap anche su Bing.
5. Testa rich results:
   - https://search.google.com/test/rich-results
   - https://validator.schema.org/
6. Misura Core Web Vitals reali:
   - PageSpeed Insights
   - Search Console CWV report
7. Aggiorna campi placeholder in `/note-legali/`:
   - Partita IVA
   - REA
8. Se disponibile, collega `sameAs` organizzazione a profili ufficiali e Wikidata.

## Uso script IndexNow

```bash
node scripts/indexnow-submit.mjs \
  https://storiesociali.org/ \
  https://storiesociali.org/chi-siamo/
```

## Note hosting

- Il file `/_headers` funziona su piattaforme che supportano header rules stile Netlify/adapter compatibili.
- Se hosting diverso (Nginx/Apache/Cloudflare), replicare stesse policy in configurazione server/CDN.
