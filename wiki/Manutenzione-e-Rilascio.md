# Manutenzione e Rilascio

## Flusso di release

1. Merge su `main`
2. Cloudflare Pages triggera automaticamente il build (`node scripts/inject-date.js`)
3. Verifica log build nella dashboard Cloudflare
4. Smoke test su dominio live (vedi checklist sotto)

## Prima di ogni merge su main

### Funzionalità

- [ ] Wizard completo step 1 → 7 senza errori console
- [ ] Salvataggio storia e riapertura dall'archivio
- [ ] Modifica storia salvata e ri-salvataggio
- [ ] Eliminazione storia con dialog di conferma
- [ ] Export stampa — layout corretto, nessun testo troncato
- [ ] Export PDF — font Lora presente, accenti italiani corretti
- [ ] Copia testo — contenuto coerente con l'anteprima

### Accessibilità

- [ ] Navigazione wizard completa da tastiera (Tab, Spazio per radio, frecce su select)
- [ ] `aria-invalid` attivo su `directiveInput` quando la frase è errata
- [ ] Annuncio step aggiornato per screen reader (`#stepAnnouncer`)
- [ ] Tema alto contrasto: testo leggibile su tutti i componenti
- [ ] Font OpenDyslexic: si carica solo al cambio, non al load iniziale

### SEO tecnico

- [ ] `canonical` presente e corretto in tutte le pagine
- [ ] JSON-LD sintatticamente valido (zero errori in [Rich Results Test](https://search.google.com/test/rich-results))
- [ ] `dateModified` aggiornato da `inject-date.js`
- [ ] `sitemap.xml` con `lastmod` aggiornato

### PWA e performance

- [ ] Service worker attivo e in stato `activated` (`DevTools > Application > Service Workers`)
- [ ] `CACHE_VERSION` aggiornato in `sw.js` se ci sono modifiche rilevanti
- [ ] Nessun font di Google Fonts o cdnfonts.com bloccante nel waterfall iniziale
- [ ] `DevTools > Lighthouse` — nessuna regressione critica su Performance e Accessibility

### Pagine informative

- [ ] `/chi-siamo/` — header e footer di navigazione presenti
- [ ] `/privacy/` — accessibile e con link di ritorno alla home
- [ ] `/cookie/` — idem
- [ ] `/note-legali/` — idem

## Comandi utili

```bash
# Aggiorna dateModified e sitemap (normalmente eseguito da Cloudflare Pages)
node scripts/inject-date.js

# Notifica IndexNow (opzionale, per rilanci urgenti)
node scripts/indexnow-submit.mjs
```

## Aggiornamento CACHE_VERSION

Ogni volta che vengono modificati file cachettati dal service worker, aggiornare in `sw.js`:

```js
const CACHE_VERSION = 'storiesociali-v20260430b'; // ← cambiare questa stringa
```

Convenzione suggerita: `storiesociali-vYYYYMMDD` con lettera incrementale se ci sono più release nello stesso giorno (`a`, `b`, `c`...).

## Aggiornamento JSON-LD

Se si modificano i dati strutturati:

1. Modificare il blocco corrispondente nell'`@graph` di `index.html`
2. Validare su [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
3. Se si aggiungono/modificano domande FAQ: aggiornare sia il JSON-LD che l'HTML `<details>` in `#faq-storie-sociali`

## Monitoring

Il progetto non ha analytics integrati. Il monitoraggio SEO è esterno (Google Search Console, se configurata). Per verificare lo stato della cache del SW in produzione: aprire `DevTools > Application > Service Workers` con la URL live.
