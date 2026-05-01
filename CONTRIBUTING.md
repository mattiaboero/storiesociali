# Contribuire a storiesociali.org

storiesociali.org è un progetto educativo orientato all'accessibilità. I contributi sono benvenuti, in particolare su accessibilità, performance e correttezza del metodo Carol Gray applicato al wizard.

## Prima di iniziare

Leggi il [README](README.md) per capire architettura e obiettivi del progetto. Se stai pianificando una modifica sostanziale — nuova funzionalità, cambio di struttura HTML, modifica al JSON-LD — apri prima una issue per discuterla. Evita di lavorare a lungo su una direzione senza confronto.

## Flusso di lavoro

1. Crea un branch da `main` con nome descrittivo (es. `fix/radio-focus`, `feat/esempio-storia`).
2. Mantieni le modifiche piccole e atomiche — una cosa per PR.
3. Testa su desktop e mobile, con browser moderni (Chrome, Firefox, Safari).
4. Apri la PR con descrizione chiara e checklist compilata.

## Convenzioni tecniche

**Nessun framework.** Il progetto usa vanilla HTML, CSS e JavaScript. Non introdurre dipendenze esterne senza discussione preventiva — ogni libreria aggiunge complessità al deploy e rischi al CSP.

**Accessibilità non è opzionale.** Qualsiasi modifica all'UI deve preservare: navigazione da tastiera completa, `aria-live` su preview e toast, contrasto minimo WCAG AA, compatibilità con screen reader. Verifica con axe DevTools o WAVE prima di aprire la PR.

**Il copy pedagogico ha regole precise.** Le frasi direttive usano sempre `Posso`, `Proverò a` o `Potrei`. Le frasi affermative non contengono imperativi. Modifiche al testo dei placeholder, degli esempi rapidi o delle storie di esempio vanno motivate con riferimento al metodo Carol Gray.

**SEO tecnico stabile.** Non modificare `canonical`, `hreflang`, JSON-LD o `sitemap.xml` senza verificare che il Rich Results Test non produca nuovi errori.

**Commit messages in italiano o inglese**, formato convenzionale:

```
fix: migliora focus visibility nei radio custom
feat: aggiunge storia esempio "visita medica"
docs: aggiorna wiki deploy Cloudflare
a11y: aggiunge aria-describedby su directiveInput
seo: aggiorna FAQPage JSON-LD con quinta domanda
```

## Checklist PR

Prima di aprire la pull request, verifica:

- [ ] Nessun errore in console (desktop e mobile)
- [ ] Navigazione wizard completa da tastiera (Tab, Spazio, frecce)
- [ ] Preview storia coerente in tutti e 7 gli step
- [ ] Export stampa e PDF funzionanti (accenti italiani corretti nel PDF)
- [ ] Service worker si installa senza errori (`DevTools > Application > Service Workers`)
- [ ] SEO tecnico non regressivo — `canonical`, JSON-LD e sitemap intatti
- [ ] Se modificato il CSS: contrasto `--color-text-secondary` >= 4.5:1 su bianco

## Cosa non fare

- Refactor massivi non richiesti, anche se il codice sembra migliorabile.
- Modifiche simultanee a UI, logica e copy nella stessa PR.
- Rimozione di fallback di accessibilità anche se sembrano ridondanti.
- Modifiche al copy delle pagine legali (`privacy`, `cookie`, `note-legali`) senza validazione del maintainer.
- Introduzione di `localStorage` per dati diversi dalle storie utente.

## Contatto

Per domande prima di iniziare a lavorare su qualcosa: apri una issue con label `question` o scrivi a `info@storiesociali.org`.
