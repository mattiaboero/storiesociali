# Roadmap

Direzione futura del progetto. Le priorità cambiano in base al feedback degli utenti — insegnanti, terapisti, famiglie.

## In lavorazione

- **Sezione esempi in homepage** — 6 storie sociali originali per situazioni frequenti (ricreazione, mensa, visita medica, compagno nuovo, gita, fila) con visualizzazione tipizzata. Aumenta il contenuto SEO e mostra all'utente il formato atteso prima di avviare il wizard.

## Breve termine

- **Export JSON delle storie** — permettere all'utente di esportare e importare le storie in formato `.json` come backup esterno al browser. Utile quando si cambia dispositivo o browser.
- **Espansione contenuto articolo SEO** — portare l'articolo della homepage a 1.000+ parole con sezione sui 4 tipi di frase, fascia d'età, e esempi espliciti del metodo Carol Gray.
- **Checklist verifica manuale strutturata** — documento di test ripetibile (step, input, comportamento atteso) per ridurre i tempi di verifica pre-release.

## Medio termine

- **Stampa multi-storia** — selezionare più storie dall'archivio e stamparle o esportarle in un unico PDF.
- **Analytics privacy-first** — integrazione opzionale con Plausible o Fathom per capire quali step generano più abbandoni, senza tracciamento utente.
- **Export PDF tipografico migliorato** — layout con titolo in evidenza, separatori visivi tra frasi, spazio immagini reale (non solo segnaposto).
- **Campo "note per il bambino"** — testo libero opzionale in chiusura della storia, per personalizzazioni che non rientrano nella struttura tipizzata.
- **Aggiornamento progressivo del service worker** — notifica visiva quando è disponibile una nuova versione, con pulsante "Aggiorna".

## Lungo termine

- **Pagine standalone per le storie esempio** — ogni storia di esempio come URL dedicata (`/esempi/ricreazione/`), con metadata e JSON-LD propri, per intercettare query navigazionali specifiche.
- **Supporto multilingua** — interfaccia in altre lingue (spagnolo, francese) mantenendo la generazione di storie in italiano. Richiede ristrutturazione del sistema di traduzione.
- **Entity graph GEO** — costruire autorevolezza tramite menzioni da fonti del settore educativo italiano (università, associazioni ABA, portali scuola inclusiva).
- **Modalità "visualizzazione semplificata"** — interfaccia ridotta per utenti finali non tecnici che vogliono solo leggere o stampare storie predefinite senza usare il wizard.

## Non nel perimetro attuale

- App nativa (iOS/Android) — la PWA copre il caso d'uso offline in modo sufficiente
- Condivisione storie tra utenti — richiederebbe backend e account, in contrasto con il principio privacy-by-design
- Generazione automatica via AI — il punto centrale del progetto è che la storia viene scritta dall'insegnante o terapista, non generata automaticamente
