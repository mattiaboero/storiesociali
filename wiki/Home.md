# Wiki — storiesociali.org

Documentazione tecnica e operativa del progetto. Rivolta a maintainer, sviluppatori che contribuiscono, e content editor che aggiornano copy o pagine informative.

## Indice

| Pagina | Contenuto |
|---|---|
| [Architettura Tecnica](Architettura-Tecnica.md) | Struttura app, file chiave, state management, export, PWA |
| [Guida al Wizard](Guida-Wizard.md) | Come funziona ogni step, logica di build, validazione frasi |
| [Installazione e Deploy](Installazione-e-Deploy.md) | Avvio locale, deploy Cloudflare Pages, script di build |
| [SEO, AEO e GEO](SEO-AEO-GEO.md) | JSON-LD, sitemap, llms.txt, come aggiornare i metadata |
| [Manutenzione e Rilascio](Manutenzione-e-Rilascio.md) | Checklist pre-release, flusso di deploy, smoke test |
| [FAQ Tecniche](FAQ-Tecniche.md) | Domande frequenti su architettura, localStorage, export, CSP |
| [Roadmap](Roadmap.md) | Direzione futura del progetto |

## Convenzione versioni

Le versioni seguono la data di rilascio (`v20260430`). Il numero di versione è usato nel `CACHE_VERSION` del service worker — ogni modifica rilevante richiede aggiornamento manuale per invalidare la cache.

## Contatto

Maintainer: Mattia Boero — `info@storiesociali.org`
