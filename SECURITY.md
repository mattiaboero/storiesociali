# Security Policy

## Versione supportata

La versione in produzione è quella deployata automaticamente dal branch `main` su Cloudflare Pages. Non esistono versioni precedenti con supporto attivo.

## Come segnalare una vulnerabilità

**Non aprire issue pubbliche per vulnerabilità di sicurezza.** Invia la segnalazione via email a `info@storiesociali.org`.

Includi nella segnalazione:

- Descrizione del problema
- Passi per riprodurlo (con browser, dispositivo, contesto)
- Impatto stimato
- Proof of concept, se disponibile

## Tempi di risposta indicativi

| Fase | Tempo |
|---|---|
| Conferma ricezione | entro 72 ore |
| Prima valutazione | entro 7 giorni |
| Patch o mitigazione | in base alla gravità |

## Perimetro

Vengono trattate come priorità alta:

- XSS e injection (il CSP è configurato, ma potrebbero esserci bypass)
- Violazioni del CSP dichiarato in `_headers`
- Accesso non autorizzato a dati `localStorage` dell'utente
- Comportamenti anomali del service worker che potrebbero servire contenuto compromesso
- Vulnerabilità nelle dipendenze (jsPDF, Google Fonts)
- Regressioni sulle pagine trust (`privacy`, `cookie`, `note-legali`)

## Note sull'architettura

L'app è interamente client-side. Non ci sono API server, database o autenticazione. I dati delle storie restano nel browser dell'utente. Il perimetro di attacco principale è il browser stesso e le risorse esterne caricate (CDN font, jsPDF via jsdelivr).
