# FAQ Tecniche

## Storage e dati

**Dove vengono salvate le storie?**
In `localStorage` del browser, con chiave `socialStories_v1`. Il payload è un array JSON di oggetti — ognuno è una copia serializzata di `state.form` al momento del salvataggio, con `id` (timestamp) e `savedAt`. I dati non lasciano mai il dispositivo dell'utente.

**Cosa succede se l'utente svuota la cache o cancella i dati del browser?**
Le storie vengono perse definitivamente. Non esiste backup automatico. Si potrebbe considerare un export JSON come funzionalità futura.

**Quante storie si possono salvare?**
Il limite è quello di `localStorage` del browser (circa 5MB per dominio). Con i payload attuali si possono salvare centinaia di storie prima di raggiungere il limite.

## Architettura

**Serve un backend?**
No. L'app è completamente client-side. Non ci sono chiamate a API server, nessun database, nessuna sessione.

**Perché vanilla JS e non un framework?**
Nessun framework significa nessun bundle, nessun transpiler, nessuna dipendenza da aggiornare regolarmente. Il codice gira direttamente nel browser senza preprocessamento. Per un'app di questa complessità il vantaggio dei framework non compensa l'overhead di manutenzione.

**Posso usare un hosting diverso da Cloudflare Pages?**
Sì, qualsiasi hosting statico funziona (Netlify, GitHub Pages, Vercel, ecc.). La configurazione specifica di Cloudflare è nei file `_headers` (response headers) e nel comando di build. Su altri hosting bisogna configurare manualmente i response header equivalenti per CSP, HSTS e Cache-Control.

## Build e deploy

**Perché c'è lo script `inject-date.js`?**
Perché il sito è un file HTML statico e non ha un sistema di template che aggiorna le date a runtime. Lo script risolve una necessità tecnica precisa: Google usa `dateModified` nel JSON-LD come segnale di freschezza. Se la data rimane ferma anche dopo modifiche, il segnale diventa inaccurato. Lo script gira una volta per deploy e risolve il problema senza runtime.

**Devo aggiornare qualcosa manualmente ad ogni release?**
Sì: la variabile `CACHE_VERSION` in `sw.js`. Senza questo aggiornamento il service worker non invalida la cache precedente e gli utenti potrebbero vedere la versione vecchia.

## Font e CSS

**Come funziona il caricamento del font OpenDyslexic?**
Il `<link rel="stylesheet">` per cdnfonts.com è stato rimosso dall'head. Il font viene iniettato dinamicamente da `loadDyslexicFont()` in `app.js` solo quando l'utente seleziona quel font allo step 7. La funzione gestisce il caso in cui il link esista già nel DOM (navigazione back/forward) e usa `dataset.loaded` per evitare duplicati.

**Perché Google Fonts è caricato con `media="print"`?**
Per evitare il blocco del rendering. Un `<link rel="stylesheet">` standard blocca la costruzione del DOM finché il CSS non è scaricato. Con `media="print"` il browser lo scarica in background senza bloccare. L'attivazione avviene via JS (`link.media = 'all'`). Il `preload` del file `.woff2` garantisce che il font sia già scaricato quando serve.

**Come funziona il font embedding nel PDF?**
`jsPDF` non supporta caratteri italiani accentati con Helvetica (il font predefinito). `loadPdfFontBase64()` carica il file `.ttf` di Lora Regular, lo converte in base64, e lo registra in jsPDF come font custom. Il PDF incorpora il font, quindi è autocontenuto. Il fallback è un secondo URL su CDN se il file locale non è disponibile.

## Accessibilità

**Perché i radio button sono nascosti con visually-hidden e non `display:none`?**
`display:none` rimuove l'elemento dall'albero di accessibilità e dal tab order. Con la tecnica visually-hidden (position absolute, clip, dimensioni 1px) l'input è presente nel DOM, riceve focus nativo, è navigabile con Tab e attivabile con Spazio. Gli screen reader lo leggono correttamente. Il feedback visivo è gestito dalla classe `.radio-option:focus-within`.

## SEO e JSON-LD

**Come faccio a validare il JSON-LD dopo una modifica?**
Usa [search.google.com/test/rich-results](https://search.google.com/test/rich-results) per validare FAQPage, HowTo e SoftwareApplication. Usa [validator.schema.org](https://validator.schema.org) per la validazione Schema.org completa.

**Cosa succede se `FAQPage` JSON-LD e `<details>` HTML non sono allineati?**
Google confronta le domande dichiarate nel JSON-LD con quelle visibili nell'HTML. Se non corrispondono, il rich snippet FAQ non viene mostrato. Ogni modifica a una domanda FAQ va applicata in entrambi i punti.

## CSP

**La CSP blocca qualcosa di inaspettato?**
Le principali origini esterne ammesse sono: `cdn.jsdelivr.net` (jsPDF), `fonts.googleapis.com` + `fonts.gstatic.com` (Google Fonts), `fonts.cdnfonts.com` (OpenDyslexic), `api.indexnow.org` (notifiche IndexNow). Se si aggiunge una nuova risorsa esterna, va aggiunta alla direttiva appropriata in `_headers`. L'iniezione dinamica di stylesheet (es. OpenDyslexic) usa `style-src`, non `connect-src`.
