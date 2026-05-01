# Guida al Wizard

Il wizard costruisce la storia passo per passo. Ogni step aggiorna `state.form`, che viene usato da `buildStory()` per generare le frasi in tempo reale. L'anteprima nella colonna destra si aggiorna ad ogni modifica.

## Step 1 — Protagonista

**Campo `protagonistType`:** `"personal"` (prima persona) o `"generic"` (terza persona). Determina come vengono costruite tutte le frasi: con "io/posso/mi sento" o con "lui/lei/nome del bambino".

**Campo `protagonistName`:** usato come soggetto delle frasi in terza persona, e come etichetta nel titolo dell'anteprima.

**Campo `ageRange`:** `"3-5"` / `"6-8"` / `"9-12"`. Controlla:
- Il limite di parole per frase: 8 / 11 / 12 parole
- Il testo dell'hint pedagogico visualizzato sotto il selettore

L'adattamento del lessico avviene tramite `applicaSostituzioni()`, che suggerisce alternative più semplici nel pannello lessicale — ma non modifica il testo automaticamente.

## Step 2 — Situazione

**Campo `situation`:** descrizione libera della situazione da spiegare. È il campo più importante: guida il tono e il contesto di tutte le frasi successive.

I **chip di esempio** (`La ricreazione a scuola`, `Il momento della mensa`, ecc.) compilano il campo con testo di partenza modificabile. Non sostituiscono il testo già scritto senza conferma.

Il pannello `situationComplexPreview` mostra subito un'analisi del lessico del testo inserito.

## Step 3 — Contesto descrittivo

Quattro campi: `where`, `when`, `who`, `whatOthers`. Ogni campo alimenta `buildDescriptiveSentence()`, che assembla una frase descrittiva con questa logica:

1. `where` + `when` formano il contesto di apertura
2. `who` + `whatOthers` vengono concatenati, con logica per evitare ripetizioni quando `whatOthers` inizia già con il soggetto di `who`

Il pannello `descriptivePreview` mostra l'anteprima della frase prodotta mentre si compila.

## Step 4 — Prospettiva

**Campo `perspective`:** frase sulle emozioni o intenzioni delle persone presenti (compagni, insegnante, genitore). Deve essere in terza persona e descrivere stati interni, non azioni.

**Campo `perspectiveExtra`:** seconda frase prospettica opzionale. I chip suggeriscono pattern tipici ("I miei compagni sono contenti quando...", "La maestra vuole che...").

## Step 5 — Azione direttiva

**Campo `directive`:** la frase più delicata della storia. Deve iniziare con `Posso`, `Proverò a` o `Potrei` e non contenere imperativi o forme obbligatorie (`devo`, `bisogna`, `sempre`).

`updateDirectiveWarning()` controlla in tempo reale:
1. Presenza di parole vietate (`devo`, `deve`, `devono`, `dobbiamo`, `bisogna`, `obbligatorio`, `sempre`)
2. Inizio corretto con le formule ammesse

Quando la validazione fallisce, imposta `aria-invalid="true"` sull'input e mostra il messaggio nel pannello `directiveWarning` (che ha `aria-describedby` collegato all'input).

## Step 6 — Rinforzo affermativo

**Campo `affirmativePreset`:** tre valori:
- `preset_retry` → "Va bene se non riesco subito. Posso riprovare."
- `preset_help` → "Gli adulti mi possono aiutare."
- `custom` → abilita il campo `affirmativeCustom`

Quando `affirmativePreset === "custom"`, il campo testo viene abilitato e il suo contenuto viene usato da `buildAffirmativeSentence()`.

## Step 7 — Stile e export

**Stile visivo:** `minimal` / `colorful` / `high-contrast`. La classe CSS corrispondente viene applicata a `<body>`.

**Spazio immagini:** `none` / `small` / `large`. Aggiunge segnaposto visivi tra le frasi nell'anteprima e nella stampa.

**Font:** `standard` (Lora/DM Sans) / `dyslexic` (OpenDyslexic, caricato on-demand) / `uppercase` (maiuscolo con CSS `text-transform`).

**Azioni finali:**
- **Salva** — serializza `state.form` in `localStorage`
- **Copia testo** — copia il testo della storia negli appunti
- **Stampa** — `window.print()` con layout ottimizzato
- **Scarica PDF** — carica jsPDF on-demand, incorpora font Lora, genera PDF

## Navigazione tra step

I pulsanti "Avanti" / "Indietro" cambiano `state.currentStep` e aggiornano le classi `.active` sui `section.step-content`. Lo step indicator (puntini) mostra il progresso. Ogni cambio step aggiorna il testo `aria-live` in `#stepAnnouncer` per i screen reader.

## Come aggiungere un nuovo preset

Per aggiungere una nuova opzione ai chip di esempio (situazione o prospettiva), modificare l'HTML dei `button.chip` nella sezione corrispondente di `index.html`. Il valore dell'attributo `data-example` o `data-perspective` viene copiato direttamente nel campo input — nessuna modifica a `app.js` necessaria.
