const STORAGE_KEY = "socialStories_v1";
const STEP_TOTAL = 7;
const JSPDF_CDN_URL = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
const PDF_FONT_URLS = [
  "/assets/fonts/lora-regular.ttf",
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/lora/Lora-Regular.ttf"
];
const PDF_FONT_FILENAME = "Lora-Regular.ttf";
const PDF_FONT_FAMILY = "LoraPDF";

let pdfFontBase64Cache = null;
let pdfFontLoadPromise = null;

const AGE_HINTS = {
  "3-5": "Suggerimenti molto semplici: frasi corte, parole concrete, 6-8 parole.",
  "6-8": "Suggerimenti equilibrati: frasi chiare, massimo 10-12 parole.",
  "9-12": "Suggerimenti più ricchi: lessico leggermente più ampio, sempre chiaro."
};

const SITUATION_PRESETS = {
  "La ricreazione a scuola": {
    situation: "alla ricreazione a scuola c'è molto rumore",
    where: "A scuola",
    when: "durante la ricreazione",
    who: "i miei compagni",
    whatOthers: "giocano nel cortile",
    perspective: "I miei compagni sono contenti quando gioco con calma",
    directive: "Posso aspettare il mio turno per giocare",
    title: "La ricreazione"
  },
  "Il momento della mensa": {
    situation: "alla mensa ci sono odori forti e tante voci",
    where: "In mensa",
    when: "all'ora di pranzo",
    who: "i bambini e gli adulti",
    whatOthers: "mangiano e parlano piano",
    perspective: "Gli adulti vogliono che tutti mangino tranquilli",
    directive: "Proverò a sedermi e respirare piano",
    title: "Il momento della mensa"
  },
  "Andare dal medico": {
    situation: "vado dal medico per un controllo",
    where: "Nello studio medico",
    when: "quando ho una visita",
    who: "il medico e un adulto",
    whatOthers: "mi spiegano cosa succede",
    perspective: "Il medico vuole aiutarmi a stare bene",
    directive: "Posso fare una domanda se ho paura",
    title: "Andare dal medico"
  },
  "Un nuovo compagno di classe": {
    situation: "arriva un nuovo compagno in classe",
    where: "In classe",
    when: "all'inizio della giornata",
    who: "la maestra e i compagni",
    whatOthers: "si presentano con gentilezza",
    perspective: "Il nuovo compagno può sentirsi emozionato",
    directive: "Potrei dire ciao e sorridere",
    title: "Un nuovo compagno"
  },
  "La gita scolastica": {
    situation: "la classe fa una gita fuori scuola",
    where: "Fuori scuola",
    when: "nel giorno della gita",
    who: "la classe e gli insegnanti",
    whatOthers: "seguono il gruppo",
    perspective: "Gli insegnanti vogliono che tutti restino vicini",
    directive: "Posso restare vicino al mio gruppo",
    title: "La gita scolastica"
  },
  "Fare la fila": {
    situation: "devo aspettare in fila prima del mio turno",
    where: "Nel corridoio",
    when: "prima di entrare",
    who: "i bambini",
    whatOthers: "aspettano il loro turno",
    perspective: "Gli altri stanno meglio quando c'è ordine",
    directive: "Proverò a tenere mani ferme e aspettare",
    title: "Fare la fila"
  }
};

const SOSTITUZIONI = [
  { da: "effettuare", a: "fare" },
  { da: "utilizzare", a: "usare" },
  { da: "comunicare", a: "dire" },
  { da: "trasmettere", a: "mandare" },
  { da: "acquisire", a: "ottenere" },
  { da: "acquisire", a: "avere" },
  { da: "provvedere", a: "fare" },
  { da: "procedere", a: "andare avanti" },
  { da: "recarsi", a: "andare" },
  { da: "predisporre", a: "preparare" },
  { da: "predisporre", a: "fare" },
  { da: "richiedere", a: "chiedere" },
  { da: "necessitare", a: "avere bisogno" },
  { da: "consentire", a: "permettere" },
  { da: "consentire", a: "lasciare" },
  { da: "constatare", a: "vedere" },
  { da: "manifestare", a: "mostrare" },
  { da: "manifestare", a: "dire" },
  { da: "dichiarare", a: "dire" },
  { da: "affermare", a: "dire" },
  { da: "asserire", a: "dire" },
  { da: "sostenere", a: "dire" },
  { da: "ribadire", a: "ripetere" },
  { da: "evidenziare", a: "mostrare" },
  { da: "sottolineare", a: "mettere in chiaro" },
  { da: "precisare", a: "spiegare" },
  { da: "specificare", a: "spiegare" },
  { da: "indicare", a: "mostrare" },
  { da: "individuare", a: "trovare" },
  { da: "identificare", a: "trovare" },
  { da: "verificare", a: "controllare" },
  { da: "valutare", a: "guardare" },
  { da: "monitorare", a: "controllare" },
  { da: "garantire", a: "assicurare" },
  { da: "assicurare", a: "promettere" },
  { da: "implementare", a: "mettere in pratica" },
  { da: "ottimizzare", a: "migliorare" },
  { da: "incrementare", a: "aumentare" },
  { da: "ridurre", a: "diminuire" },
  { da: "attivare", a: "avviare" },
  { da: "avviare", a: "iniziare" },
  { da: "cessare", a: "smettere" },
  { da: "concludere", a: "finire" },
  { da: "ultimare", a: "finire" },
  { da: "portare a termine", a: "finire" },
  { da: "intraprendere", a: "iniziare" },
  { da: "svolgere", a: "fare" },
  { da: "espletare", a: "fare" },
  { da: "adempiere", a: "fare" },
  { da: "ottemperare", a: "rispettare" },
  { da: "osservare", a: "rispettare" },
  { da: "rispettare", a: "seguire" },
  { da: "perseguire", a: "cercare" },
  { da: "conseguire", a: "ottenere" },
  { da: "raggiungere", a: "arrivare a" },
  { da: "pervenire", a: "arrivare" },
  { da: "giungere", a: "arrivare" },
  { da: "reperire", a: "trovare" },
  { da: "rintracciare", a: "trovare" },
  { da: "ricercare", a: "cercare" },
  { da: "esaminare", a: "guardare" },
  { da: "analizzare", a: "studiare" },
  { da: "elaborare", a: "preparare" },
  { da: "redigere", a: "scrivere" },
  { da: "compilare", a: "riempire" },
  { da: "sottoscrivere", a: "firmare" },
  { da: "visionare", a: "guardare" },
  { da: "consultare", a: "guardare" },
  { da: "riscontrare", a: "trovare" },
  { da: "rilevare", a: "notare" },
  { da: "riscontrare", a: "vedere" },
  { da: "appurare", a: "scoprire" },
  { da: "accertare", a: "controllare" },
  { da: "confermare", a: "dire che sì" },
  { da: "condividere", a: "dire" },
  { da: "recepire", a: "capire" },
  { da: "comprendere", a: "capire" },
  { da: "percepire", a: "sentire" },
  { da: "ritenere", a: "pensare" },
  { da: "reputare", a: "pensare" },
  { da: "stimare", a: "pensare" },
  { da: "ravvisare", a: "vedere" },
  { da: "auspicare", a: "sperare" },
  { da: "auspicabile", a: "desiderabile" },
  { da: "dirigersi verso", a: "andare verso" },
  { da: "spostarsi", a: "andare" },
  { da: "transitare", a: "passare" },
  { da: "attraversare", a: "passare" },
  { da: "accedere", a: "entrare" },
  { da: "uscire da", a: "lasciare" },
  { da: "permanere", a: "restare" },
  { da: "sostare", a: "fermarsi" },
  { da: "collocare", a: "mettere" },
  { da: "posizionare", a: "mettere" },
  { da: "allocare", a: "mettere" },
  { da: "depositare", a: "mettere" },
  { da: "rimuovere", a: "togliere" },
  { da: "estrarre", a: "togliere" },
  { da: "inserire", a: "mettere dentro" },
  { da: "immettere", a: "mettere dentro" },
  { da: "documentazione", a: "documenti" },
  { da: "modulistica", a: "moduli" },
  { da: "istanza", a: "richiesta" },
  { da: "domanda", a: "richiesta" },
  { da: "richiesta formale", a: "richiesta" },
  { da: "procedura", a: "modo di fare" },
  { da: "iter", a: "percorso" },
  { da: "adempimento", a: "cosa da fare" },
  { da: "incombenza", a: "cosa da fare" },
  { da: "onere", a: "obbligo" },
  { da: "beneficiario", a: "chi riceve" },
  { da: "soggetto", a: "persona" },
  { da: "individuo", a: "persona" },
  { da: "utente", a: "persona" },
  { da: "cittadino", a: "persona" },
  { da: "interlocutore", a: "persona con cui si parla" },
  { da: "destinatario", a: "chi riceve" },
  { da: "mittente", a: "chi manda" },
  { da: "erogazione", a: "consegna" },
  { da: "fornitura", a: "consegna" },
  { da: "prestazione", a: "servizio" },
  { da: "servizio erogato", a: "servizio" },
  { da: "contributo", a: "soldi" },
  { da: "emolumento", a: "paga" },
  { da: "retribuzione", a: "paga" },
  { da: "compenso", a: "paga" },
  { da: "rendicontazione", a: "resoconto" },
  { da: "rendiconto", a: "resoconto" },
  { da: "reportistica", a: "relazioni" },
  { da: "tempistiche", a: "tempi" },
  { da: "scadenzario", a: "calendario scadenze" },
  { da: "arco temporale", a: "periodo" },
  { da: "lasso di tempo", a: "periodo" },
  { da: "fattispecie", a: "caso" },
  { da: "casistica", a: "casi" },
  { da: "problematica", a: "problema" },
  { da: "tematica", a: "argomento" },
  { da: "criticità", a: "problema" },
  { da: "risorsa", a: "mezzo" },
  { da: "strumento", a: "mezzo" },
  { da: "modalità", a: "modo" },
  { da: "tipologia", a: "tipo" },
  { da: "categoria", a: "tipo" },
  { da: "contesto", a: "situazione" },
  { da: "scenario", a: "situazione" },
  { da: "framework", a: "struttura" },
  { da: "outcome", a: "risultato" },
  { da: "output", a: "risultato" },
  { da: "feedback", a: "risposta" },
  { da: "input", a: "informazione" },
  { da: "adeguato", a: "giusto" },
  { da: "idoneo", a: "giusto" },
  { da: "opportuno", a: "giusto" },
  { da: "appropriato", a: "giusto" },
  { da: "pertinente", a: "che riguarda" },
  { da: "inerente", a: "che riguarda" },
  { da: "relativo a", a: "su" },
  { da: "concernente", a: "su" },
  { da: "vigente", a: "in uso ora" },
  { da: "attuale", a: "di adesso" },
  { da: "odierno", a: "di oggi" },
  { da: "pregressa", a: "precedente" },
  { da: "pregresso", a: "passato" },
  { da: "antecedente", a: "precedente" },
  { da: "successivo", a: "dopo" },
  { da: "anteriore", a: "prima" },
  { da: "contestuale", a: "nello stesso momento" },
  { da: "simultaneo", a: "nello stesso momento" },
  { da: "immediato", a: "subito" },
  { da: "tempestivo", a: "veloce" },
  { da: "celere", a: "veloce" },
  { da: "sollecito", a: "veloce" },
  { da: "obbligatorio", a: "da fare per forza" },
  { da: "facoltativo", a: "che si può scegliere" },
  { da: "discrezionale", a: "che si può scegliere" },
  { da: "eventuale", a: "possibile" },
  { da: "presumibile", a: "probabile" },
  { da: "ipotetico", a: "possibile" },
  { da: "definitivo", a: "finale" },
  { da: "provvisorio", a: "non ancora definitivo" },
  { da: "temporaneo", a: "per poco tempo" },
  { da: "permanente", a: "per sempre" },
  { da: "significativo", a: "importante" },
  { da: "rilevante", a: "importante" },
  { da: "considerevole", a: "grande" },
  { da: "ingente", a: "molto grande" },
  { da: "esiguo", a: "piccolo" },
  { da: "limitato", a: "poco" },
  { da: "al fine di", a: "per" },
  { da: "allo scopo di", a: "per" },
  { da: "con l'obiettivo di", a: "per" },
  { da: "in virtù di", a: "grazie a" },
  { da: "a seguito di", a: "dopo" },
  { da: "in seguito a", a: "dopo" },
  { da: "a fronte di", a: "di fronte a" },
  { da: "in merito a", a: "su" },
  { da: "con riferimento a", a: "su" },
  { da: "relativamente a", a: "su" },
  { da: "in relazione a", a: "su" },
  { da: "con riguardo a", a: "su" },
  { da: "in ordine a", a: "su" },
  { da: "per quanto riguarda", a: "su" },
  { da: "ai sensi di", a: "secondo" },
  { da: "a norma di", a: "secondo" },
  { da: "in conformità a", a: "secondo" },
  { da: "nel rispetto di", a: "seguendo" },
  { da: "nell'ambito di", a: "dentro" },
  { da: "in seno a", a: "dentro" },
  { da: "all'interno di", a: "dentro" },
  { da: "in capo a", a: "entro" },
  { da: "entro e non oltre", a: "entro" },
  { da: "non prima di", a: "solo dopo" },
  { da: "a decorrere da", a: "a partire da" },
  { da: "con decorrenza da", a: "a partire da" },
  { da: "sino a", a: "fino a" },
  { da: "fino al momento in cui", a: "finché" },
  { da: "laddove", a: "se" },
  { da: "qualora", a: "se" },
  { da: "ove", a: "se" },
  { da: "allorché", a: "quando" },
  { da: "allorquando", a: "quando" },
  { da: "ogniqualvolta", a: "ogni volta che" },
  { da: "fatta eccezione per", a: "tranne" },
  { da: "ad eccezione di", a: "tranne" },
  { da: "a esclusione di", a: "tranne" },
  { da: "fatto salvo", a: "tranne" },
  { da: "fermo restando", a: "tenendo conto che" },
  { da: "ferme restando", a: "tenendo conto che" },
  { da: "con la precisazione che", a: "tenendo presente che" },
  { da: "si precisa che", a: "si dice che" },
  { da: "si rende noto che", a: "si sa che" },
  { da: "si comunica che", a: "si dice che" },
  { da: "si fa presente che", a: "bisogna sapere che" },
  { da: "preso atto di", a: "visto che" },
  { da: "considerato che", a: "visto che" },
  { da: "atteso che", a: "visto che" },
  { da: "premesso che", a: "prima di tutto" },
  { da: "tanto premesso", a: "detto questo" },
  { da: "quanto sopra", a: "quello scritto prima" },
  { da: "di cui sopra", a: "di cui prima" },
  { da: "come sopra indicato", a: "come già detto" },
  { da: "in altre parole", a: "cioè" },
  { da: "vale a dire", a: "cioè" },
  { da: "ossia", a: "cioè" },
  { da: "ovverosia", a: "cioè" },
  { da: "id est", a: "cioè" },
  { da: "nondimeno", a: "però" },
  { da: "ciononostante", a: "però" },
  { da: "nonostante ciò", a: "però" },
  { da: "tuttavia", a: "però" },
  { da: "peraltro", a: "però" },
  { da: "altresì", a: "anche" },
  { da: "parimenti", a: "anche" },
  { da: "similmente", a: "allo stesso modo" },
  { da: "analogamente", a: "allo stesso modo" },
  { da: "nonché", a: "e anche" },
  { da: "nonchè", a: "e anche" },
  { da: "viene effettuato", a: "si fa" },
  { da: "viene utilizzato", a: "si usa" },
  { da: "viene trasmesso", a: "si manda" },
  { da: "viene predisposto", a: "si prepara" },
  { da: "viene verificato", a: "si controlla" },
  { da: "viene garantito", a: "si assicura" },
  { da: "viene erogato", a: "si dà" },
  { da: "viene comunicato", a: "si dice" },
  { da: "viene rilevato", a: "si nota" },
  { da: "è stato effettuato", a: "è stato fatto" },
  { da: "è stata redatta", a: "è stata scritta" },
  { da: "è stato avviato", a: "è iniziato" },
  { da: "è stato concluso", a: "è finito" }
];

const SOSTITUZIONI_UNICHE = dedupeSostituzioni(SOSTITUZIONI);
const SOSTITUZIONI_ORDINATE = [...SOSTITUZIONI_UNICHE].sort((a, b) => b.da.length - a.da.length);
const SOSTITUZIONI_MAP = buildSostituzioniMap(SOSTITUZIONI_UNICHE);
const REPLACEMENT_PATTERN_CACHE = new Map();

const state = {
  stories: [],
  activeStoryId: null,
  step: 1,
  form: createDefaultForm()
};

const refs = {};
let stepTransitionTimer = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheRefs();
  bindEvents();
  registerServiceWorker();
  loadStories();
  setStep(1);
  applyFormToUI();
  updateAgeHint();
  updateDescriptivePreview();
  updateDirectiveWarning();
  updatePreviewAndGuidance();
  renderHomeList();
  showHome();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Registrazione service worker fallita", error);
    });
  });
}

function createDefaultForm() {
  return {
    protagonistType: "personal",
    protagonistName: "",
    ageRange: "6-8",
    situation: "",
    where: "",
    when: "",
    who: "",
    whatOthers: "",
    perspective: "",
    perspectiveExtra: "",
    directive: "",
    affirmativePreset: "Va bene se non riesco subito. Posso riprovare.",
    affirmativeCustom: "",
    title: "",
    visualStyle: "colorful",
    imageSpace: "none",
    fontChoice: "standard"
  };
}

function cacheRefs() {
  refs.homeScreen = document.getElementById("homeScreen");
  refs.editorScreen = document.getElementById("editorScreen");
  refs.newStoryBtn = document.getElementById("newStoryBtn");
  refs.backHomeBtn = document.getElementById("backHomeBtn");
  refs.storiesList = document.getElementById("storiesList");
  refs.emptyState = document.getElementById("emptyState");
  refs.stepIndicator = document.getElementById("stepIndicator");
  refs.stepDots = Array.from(document.querySelectorAll("[data-step-dot]"));
  refs.stepLines = Array.from(document.querySelectorAll("[data-step-line]"));
  refs.stepContents = Array.from(document.querySelectorAll(".step-content"));
  refs.wizardForm = document.getElementById("wizardForm");
  refs.appFooter = document.getElementById("appFooter");
  refs.headerStepText = document.getElementById("headerStepText");
  refs.prevStepBtn = document.getElementById("prevStepBtn");
  refs.nextStepBtn = document.getElementById("nextStepBtn");
  refs.saveStoryBtn = document.getElementById("saveStoryBtn");
  refs.printBtn = document.getElementById("printBtn");
  refs.pdfBtn = document.getElementById("pdfBtn");
  refs.copyBtn = document.getElementById("copyBtn");
  refs.storyPreview = document.getElementById("storyPreview");
  refs.previewTitle = document.getElementById("previewTitle");
  refs.previewMeta = document.getElementById("previewMeta");
  refs.previewSentences = document.getElementById("previewSentences");
  refs.balanceStatus = document.getElementById("balanceStatus");
  refs.lexicalWarnings = document.getElementById("lexicalWarnings");
  refs.ageHint = document.getElementById("ageHint");
  refs.descriptivePreview = document.getElementById("descriptivePreview");
  refs.situationComplexPreview = document.getElementById("situationComplexPreview");
  refs.directiveWarning = document.getElementById("directiveWarning");
  refs.affirmativeCustom = document.getElementById("affirmativeCustom");
  refs.stepAnnouncer = document.getElementById("stepAnnouncer");
}

function bindEvents() {
  refs.newStoryBtn.addEventListener("click", startNewStory);
  refs.backHomeBtn.addEventListener("click", () => {
    showHome();
  });

  refs.prevStepBtn.addEventListener("click", () => setStep(state.step - 1));
  refs.nextStepBtn.addEventListener("click", () => setStep(state.step + 1));
  refs.saveStoryBtn.addEventListener("click", saveCurrentStory);

  refs.printBtn.addEventListener("click", () => window.print());
  refs.pdfBtn.addEventListener("click", exportPDF);
  refs.copyBtn.addEventListener("click", copyStoryText);

  refs.wizardForm.addEventListener("input", (event) => {
    if (!event.target.matches("input[type=\"text\"], textarea")) {
      return;
    }
    onWizardChange(event);
  });

  refs.wizardForm.addEventListener("change", (event) => {
    if (!event.target.matches("input[type=\"radio\"], select")) {
      return;
    }
    onWizardChange(event);
  });

  document.getElementById("situationExamples").addEventListener("click", onSituationExampleClick);
  document.getElementById("perspectiveExamples").addEventListener("click", onPerspectiveExampleClick);

  refs.storiesList.addEventListener("click", onStoryCardAction);
}

function onWizardChange(event) {
  const { name, value } = event.target;
  if (!name) {
    return;
  }

  const valueMap = {
    protagonistType: "protagonistType",
    protagonistName: "protagonistName",
    ageRange: "ageRange",
    situationInput: "situation",
    whereInput: "where",
    whenInput: "when",
    whoInput: "who",
    whatOthersInput: "whatOthers",
    perspectiveInput: "perspective",
    perspectiveExtraInput: "perspectiveExtra",
    directiveInput: "directive",
    affirmativePreset: "affirmativePreset",
    affirmativeCustom: "affirmativeCustom",
    storyTitle: "title",
    visualStyle: "visualStyle",
    imageSpace: "imageSpace",
    fontChoice: "fontChoice"
  };

  const field = valueMap[name];
  if (field) {
    state.form[field] = value;
  }

  if (name === "ageRange") {
    updateAgeHint();
  }

  if (name === "affirmativePreset") {
    updateAffirmativeCustomState();
  }

  syncSelectionStates();
  updateDescriptivePreview();
  updateSituationComplexPreview();
  updateDirectiveWarning();
  updatePreviewAndGuidance();
}

function onSituationExampleClick(event) {
  const button = event.target.closest(".chip[data-example]");
  if (!button) {
    return;
  }

  const preset = SITUATION_PRESETS[button.dataset.example];
  if (!preset) {
    return;
  }

  state.form = {
    ...state.form,
    ...preset
  };

  applyFormToUI();
  updatePreviewAndGuidance();
}

function onPerspectiveExampleClick(event) {
  const button = event.target.closest(".chip[data-perspective]");
  if (!button) {
    return;
  }

  if (!sanitize(state.form.perspective)) {
    state.form.perspective = button.dataset.perspective;
  } else {
    state.form.perspectiveExtra = button.dataset.perspective;
  }

  applyFormToUI();
  updatePreviewAndGuidance();
}

function onStoryCardAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const storyId = button.dataset.id;
  if (!storyId) {
    return;
  }

  if (button.dataset.action === "open") {
    openStory(storyId);
    return;
  }

  if (button.dataset.action === "delete") {
    deleteStory(storyId);
  }
}

function showHome() {
  refs.homeScreen.classList.add("active");
  refs.editorScreen.classList.remove("active");
  refs.appFooter.classList.add("hidden");
  refs.headerStepText.textContent = "Archivio storie";
  renderHomeList();
}

function showEditor() {
  refs.homeScreen.classList.remove("active");
  refs.editorScreen.classList.add("active");
  refs.appFooter.classList.remove("hidden");
  updateStepIndicator();
}

function setStep(nextStep) {
  state.step = clamp(nextStep, 1, STEP_TOTAL);

  const nextSection = refs.stepContents.find((section) => Number(section.dataset.step) === state.step);
  const currentSection = refs.stepContents.find((section) => section.classList.contains("active"));

  if (stepTransitionTimer) {
    window.clearTimeout(stepTransitionTimer);
    stepTransitionTimer = null;
  }

  if (currentSection && currentSection !== nextSection) {
    currentSection.classList.add("leaving");
    stepTransitionTimer = window.setTimeout(() => {
      refs.stepContents.forEach((section) => section.classList.remove("active", "leaving"));
      if (nextSection) {
        nextSection.classList.add("active");
      }
      stepTransitionTimer = null;
      announceStepChange();
    }, 170);
  } else {
    refs.stepContents.forEach((section) => section.classList.remove("active", "leaving"));
    if (nextSection) {
      nextSection.classList.add("active");
    }
    announceStepChange();
  }

  refs.prevStepBtn.disabled = state.step === 1;
  refs.nextStepBtn.disabled = state.step === STEP_TOTAL;
  updateStepIndicator();
}

function startNewStory() {
  state.activeStoryId = null;
  state.form = createDefaultForm();
  state.step = 1;
  applyFormToUI();
  setStep(1);
  updatePreviewAndGuidance();
  showEditor();
}

function applyFormToUI() {
  setRadio("protagonistType", state.form.protagonistType);
  setValue("protagonistName", state.form.protagonistName);
  setValue("ageRange", state.form.ageRange);
  setValue("situationInput", state.form.situation);
  setValue("whereInput", state.form.where);
  setValue("whenInput", state.form.when);
  setValue("whoInput", state.form.who);
  setValue("whatOthersInput", state.form.whatOthers);
  setValue("perspectiveInput", state.form.perspective);
  setValue("perspectiveExtraInput", state.form.perspectiveExtra);
  setValue("directiveInput", state.form.directive);
  setRadio("affirmativePreset", state.form.affirmativePreset);
  setValue("affirmativeCustom", state.form.affirmativeCustom);
  setValue("storyTitle", state.form.title);
  setRadio("visualStyle", state.form.visualStyle);
  setRadio("imageSpace", state.form.imageSpace);
  setRadio("fontChoice", state.form.fontChoice);

  updateAffirmativeCustomState();
  syncSelectionStates();
  updateAgeHint();
  updateDescriptivePreview();
  updateSituationComplexPreview();
  updateDirectiveWarning();
}

function setRadio(name, value) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach((radio) => {
    radio.checked = radio.value === value;
  });
}

function setValue(idOrName, value) {
  const element = document.getElementById(idOrName) || document.querySelector(`[name="${idOrName}"]`);
  if (!element) {
    return;
  }
  element.value = value || "";
}

function syncSelectionStates() {
  document.querySelectorAll(".radio-option").forEach((option) => {
    const input = option.querySelector("input[type=\"radio\"]");
    option.classList.toggle("selected", Boolean(input && input.checked));
  });

  document.querySelectorAll(".style-card").forEach((card) => {
    const input = card.querySelector("input[type=\"radio\"]");
    card.classList.toggle("selected", Boolean(input && input.checked));
  });
}

function updateStepIndicator() {
  if (!refs.stepIndicator) {
    return;
  }

  refs.stepIndicator.setAttribute("aria-label", `Passo ${state.step} di ${STEP_TOTAL}`);

  refs.stepDots.forEach((dot) => {
    const dotStep = Number(dot.dataset.stepDot);
    dot.classList.remove("step--done", "step--active");

    if (dotStep < state.step) {
      dot.classList.add("step--done");
      return;
    }

    if (dotStep === state.step) {
      dot.classList.add("step--active");
    }
  });

  refs.stepLines.forEach((line) => {
    const lineStep = Number(line.dataset.stepLine);
    line.classList.toggle("step-line--done", lineStep < state.step);
  });

  if (refs.editorScreen.classList.contains("active")) {
    refs.headerStepText.textContent = `Passo ${state.step} di ${STEP_TOTAL}`;
  }
}

function updateAffirmativeCustomState() {
  const customSelected = state.form.affirmativePreset === "custom";
  refs.affirmativeCustom.disabled = !customSelected;
  if (!customSelected) {
    refs.affirmativeCustom.value = state.form.affirmativeCustom || "";
  }
}

function updateAgeHint() {
  refs.ageHint.textContent = AGE_HINTS[state.form.ageRange] || "";
}

function updateDescriptivePreview() {
  const text = buildDescriptiveSentence(
    state.form.where,
    state.form.when,
    state.form.who,
    state.form.whatOthers
  );

  refs.descriptivePreview.textContent =
    text || "Scrivi i campi sopra per vedere frase descrittiva generata.";
}

function updateSituationComplexPreview() {
  if (!refs.situationComplexPreview) {
    return;
  }

  const source = sanitize(state.form.situation);
  if (!source) {
    refs.situationComplexPreview.innerHTML = "Scrivi situazione: evidenzio parole complesse e alternative semplici.";
    return;
  }

  const { applicate } = applicaSostituzioni(source);
  const unique = dedupeApplied(applicate).slice(0, 6);

  if (!unique.length) {
    refs.situationComplexPreview.innerHTML = "Lessico già chiaro. Nessuna sostituzione suggerita.";
    return;
  }

  const pairs = unique.map((item) => `${item.originale} -> ${item.sostituito}`).join(" • ");
  refs.situationComplexPreview.innerHTML =
    `<strong>Semplificazioni:</strong> ${pairs}<br>${evidenziaParoleComplesse(source)}`;
}

function updateDirectiveWarning() {
  const directiveText = sanitize(state.form.directive);
  if (!directiveText) {
    refs.directiveWarning.textContent = "";
    return true;
  }

  const issues = [];
  const forbidden = /\b(devo|deve|devono|dobbiamo|bisogna|obbligatorio|sempre)\b/i;
  if (forbidden.test(directiveText)) {
    issues.push("Evita parole come 'devo' o 'bisogna'. Usa forma gentile.");
  }

  const allowedStart = /^(posso|prover[oò]\s+a|potrei)\b/i;
  if (!allowedStart.test(directiveText)) {
    issues.push("Inizia frase con: Posso..., Proverò a..., Potrei...");
  }

  refs.directiveWarning.textContent = issues.join(" ");
  return issues.length === 0;
}

function updatePreviewAndGuidance() {
  applyVisualSettings();
  const story = buildStory();
  renderPreview(story);
  renderBalance(story.balance, story.counts);
  renderLexicalWarnings();
}

function applyVisualSettings() {
  const body = document.body;

  body.classList.remove("theme--minimal", "theme--colorful", "theme--contrast");
  body.classList.remove("font-standard", "font-dyslexic", "font-uppercase");

  const themeMap = {
    minimal: "theme--minimal",
    colorful: "theme--colorful",
    "high-contrast": "theme--contrast"
  };

  body.classList.add(themeMap[state.form.visualStyle] || "theme--colorful");
  body.classList.add(`font-${state.form.fontChoice}`);

  refs.storyPreview.classList.remove("image-none", "image-small", "image-large");
  refs.storyPreview.classList.add(`image-${state.form.imageSpace}`);
}

function buildStory() {
  const descriptive = [];
  const perspective = [];
  const directive = [];
  const affirmative = [];

  const situationSentence = buildSituationSentence();
  if (situationSentence) {
    descriptive.push(situationSentence);
  }

  const descriptiveSentence = buildDescriptiveSentence(
    state.form.where,
    state.form.when,
    state.form.who,
    state.form.whatOthers
  );

  if (descriptiveSentence && !descriptive.includes(descriptiveSentence)) {
    descriptive.push(descriptiveSentence);
  }

  while (descriptive.length < 2) {
    descriptive.push(buildFallbackDescriptive(descriptive.length));
  }

  if (descriptive.length > 5) {
    descriptive.length = 5;
  }

  const perspectiveMain = buildPerspectiveSentence(state.form.perspective);
  if (perspectiveMain) {
    perspective.push(perspectiveMain);
  }

  const perspectiveExtra = buildPerspectiveSentence(state.form.perspectiveExtra);
  if (perspectiveExtra) {
    perspective.push(perspectiveExtra);
  }

  if (perspective.length === 0) {
    perspective.push(buildFallbackPerspective());
  }

  if (perspective.length > 2) {
    perspective.length = 2;
  }

  const directiveSentence = buildDirectiveSentence(state.form.directive);
  if (directiveSentence) {
    directive.push(directiveSentence);
  }

  const affirmativeSentence = buildAffirmativeSentence();
  if (affirmativeSentence) {
    affirmative.push(affirmativeSentence);
  }

  const sentences = [
    ...descriptive.map((text) => ({ type: "descriptive", text })),
    ...perspective.map((text) => ({ type: "perspective", text })),
    ...directive.map((text) => ({ type: "directive", text })),
    ...affirmative.map((text) => ({ type: "affirmative", text }))
  ];

  const counts = {
    descriptive: descriptive.length,
    perspective: perspective.length,
    directive: directive.length,
    affirmative: affirmative.length
  };

  const title = sanitize(state.form.title) || buildAutomaticTitle();
  const text = sentences.map((sentence) => sentence.text).join("\n");
  const balance = evaluateBalance(counts);

  return {
    title,
    sentences,
    text,
    counts,
    balance
  };
}

function buildSituationSentence() {
  const situation = sanitize(state.form.situation);
  if (!situation) {
    return "";
  }

  const startsWithConnector = /^(quando|se|mentre)\b/i.test(situation);
  const containsQuando = /\bquando\b/i.test(situation);

  if (state.form.protagonistType === "personal") {
    const name = sanitize(state.form.protagonistName);
    const subject = name ? `io, ${name},` : "io";

    if (startsWithConnector) {
      return normalizeSentence(`${situation}, ${subject} posso capire meglio cosa succede`, 40);
    }

    if (containsQuando) {
      return normalizeSentence(`In questa situazione, ${subject} posso capire meglio cosa succede: ${lowercaseFirst(situation)}`, 40);
    }

    return normalizeSentence(`Quando ${situation}, ${subject} posso capire meglio cosa succede`, 40);
  }

  const character = sanitize(state.form.protagonistName) || "il protagonista";

  if (startsWithConnector) {
    return normalizeSentence(`${situation}, ${character} può capire meglio cosa succede`, 40);
  }

  if (containsQuando) {
    return normalizeSentence(`In questa situazione, ${character} può capire meglio cosa succede: ${lowercaseFirst(situation)}`, 40);
  }

  return normalizeSentence(`Quando ${situation}, ${character} può capire meglio cosa succede`, 40);
}

function buildFallbackDescriptive(index) {
  const where = sanitize(state.form.where) || "In questo posto";
  const when = sanitize(state.form.when) || "in questo momento";
  const base =
    index === 0
      ? `${where} ci sono regole chiare per tutti`
      : `${when} le persone seguono passaggi semplici`;
  return normalizeSentence(base, 40);
}

function buildFallbackPerspective() {
  const who = sanitize(state.form.who) || "Le altre persone";
  return normalizeSentence(`${who} si sentono meglio quando c'è calma`);
}

function buildDescriptiveSentence(where, when, who, whatOthers) {
  const safeWhere = sanitize(where);
  const safeWhen = sanitize(when);
  const safeWho = sanitize(who);
  const safeOthers = sanitize(whatOthers);

  const pieces = [];
  if (safeWhere) {
    pieces.push(capitalize(safeWhere));
  }
  if (safeWhen) {
    pieces.push(safeWhen);
  }

  if (safeWho && safeOthers) {
    const whoLower = safeWho.toLowerCase();
    const othersLower = safeOthers.toLowerCase();
    const firstWordOthers = othersLower.split(/\s+/)[0] || "";
    const othersStartsWithWho = othersLower.startsWith(`${whoLower} `);
    const whoContainsOthersFirstWord =
      firstWordOthers.length > 2 &&
      new RegExp(`\\b${escapeRegExp(firstWordOthers)}\\b`, "i").test(whoLower);

    if (othersStartsWithWho) {
      pieces.push(safeOthers);
    } else if (whoContainsOthersFirstWord) {
      pieces.push(safeWho);
    } else {
      pieces.push(`${safeWho} ${safeOthers}`);
    }
  } else if (safeWho) {
    pieces.push(safeWho);
  } else if (safeOthers) {
    pieces.push(safeOthers);
  }

  if (pieces.length === 0) {
    return "";
  }

  return normalizeSentence(pieces.join(", "), 40);
}

function buildPerspectiveSentence(text) {
  const safe = sanitize(text);
  if (!safe) {
    return "";
  }
  return normalizeSentence(safe);
}

function buildDirectiveSentence(text) {
  const safe = sanitize(text);
  if (!safe) {
    return "";
  }

  const startRegex = /^(posso|prover[oò]\s+a|potrei)\b/i;
  let normalized = safe;
  if (!startRegex.test(normalized)) {
    normalized = `Posso ${lowercaseFirst(normalized)}`;
  }

  return normalizeSentence(normalized);
}

function buildAffirmativeSentence() {
  let source = "";
  if (state.form.affirmativePreset === "custom") {
    source = sanitize(state.form.affirmativeCustom);
  } else {
    source = sanitize(state.form.affirmativePreset);
  }

  if (!source) {
    source = "Gli adulti mi possono aiutare";
  }

  return normalizeSentence(source);
}

function normalizeSentence(text, maxWordsOverride) {
  let cleaned = sanitize(text);
  if (!cleaned) {
    return "";
  }

  cleaned = cleaned.replace(/\s+/g, " ").trim();
  cleaned = cleaned.replace(/^[\s.,;:!?]+/u, "");

  const words = cleaned.split(" ").filter(Boolean);
  const maxWords = maxWordsOverride || getSentenceWordLimit();
  const clipped = words.slice(0, maxWords).join(" ");
  const withoutTrailingPunctuation = clipped.replace(/[.,;:!?]+$/u, "").trim();
  const result = capitalize(withoutTrailingPunctuation);
  return result ? `${result}.` : "";
}

function getSentenceWordLimit() {
  const limitsByAge = {
    "3-5": 10,
    "6-8": 11,
    "9-12": 12
  };
  return limitsByAge[state.form.ageRange] || 12;
}

function dedupeSostituzioni(list) {
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const key = `${item.da.toLowerCase()}=>${item.a.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
  }
  return out;
}

function buildSostituzioniMap(list) {
  const map = new Map();
  for (const item of list) {
    const key = item.da.toLowerCase();
    if (!map.has(key)) {
      map.set(key, item.a);
    }
  }
  return map;
}

function dedupeApplied(list) {
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const key = `${item.originale.toLowerCase()}=>${item.sostituito.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
  }
  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function preserveMatchCase(match, replacement) {
  if (!match) {
    return replacement;
  }
  if (match === match.toUpperCase()) {
    return replacement.toUpperCase();
  }
  if (match[0] === match[0].toUpperCase()) {
    return capitalize(replacement);
  }
  return replacement;
}

function getReplacementPattern(da) {
  const key = da.toLowerCase();
  if (REPLACEMENT_PATTERN_CACHE.has(key)) {
    return REPLACEMENT_PATTERN_CACHE.get(key);
  }

  const escaped = escapeRegExp(da).replace(/\\\s+/g, "\\s+");
  const pattern = new RegExp(`(^|[\\s,;:.!?()\"'«»])(${escaped})(?=($|[\\s,;:.!?()\"'«»]))`, "giu");
  REPLACEMENT_PATTERN_CACHE.set(key, pattern);
  return pattern;
}

function applicaSostituzioni(testo) {
  let risultato = String(testo || "");
  const applicate = [];

  for (const { da, a } of SOSTITUZIONI_ORDINATE) {
    const pattern = getReplacementPattern(da);
    risultato = risultato.replace(pattern, (full, prefix, match) => {
      const sostituito = preserveMatchCase(match, a);
      applicate.push({ originale: match, sostituito });
      return `${prefix}${sostituito}`;
    });
  }

  return { testo: risultato, applicate };
}

function evidenziaParoleComplesse(testo) {
  let html = escapeHtml(String(testo || ""));

  for (const { da } of SOSTITUZIONI_ORDINATE) {
    const escapedDa = escapeRegExp(escapeHtml(da)).replace(/\\\s+/g, "\\s+");
    const pattern = new RegExp(`(^|[\\s,;:.!?()\"'«»])(${escapedDa})(?=($|[\\s,;:.!?()\"'«»]))`, "giu");

    html = html.replace(
      pattern,
      (full, prefix, match) =>
        `${prefix}<mark class="parola-complessa" title="Parola complessa: considera di semplificarla">${match}</mark>`
    );
  }

  return html;
}

function evaluateBalance(counts) {
  const notes = [];

  if (counts.descriptive < 2) {
    notes.push(`Aggiungi ${2 - counts.descriptive} frase descrittiva.`);
  }

  if (counts.descriptive > 5) {
    notes.push("Riduci frasi descrittive a massimo 5.");
  }

  if (counts.perspective < 1) {
    notes.push("Aggiungi almeno 1 frase prospettica.");
  }

  if (counts.perspective > 2) {
    notes.push("Riduci frasi prospettiche a massimo 2.");
  }

  const maxDirective = Math.floor(counts.descriptive / 2);
  if (counts.directive > maxDirective) {
    notes.push(`Frasi direttive troppe: massimo ${maxDirective} con ${counts.descriptive} descrittive.`);
  }

  if (counts.directive === 0) {
    notes.push("Aggiungi 1 frase direttiva con Posso/Proverò/Potrei.");
  }

  if (counts.affirmative < 1) {
    notes.push("Aggiungi almeno 1 frase affermativa.");
  }

  if (counts.affirmative > 2) {
    notes.push("Riduci frasi affermative a massimo 2.");
  }

  return {
    ok: notes.length === 0,
    notes,
    maxDirective
  };
}

function renderPreview(story) {
  refs.previewTitle.textContent = story.title;
  refs.previewMeta.textContent = `Descrittive ${story.counts.descriptive} | Prospettiche ${story.counts.perspective} | Direttive ${story.counts.directive} | Affermative ${story.counts.affirmative}`;

  refs.previewSentences.innerHTML = "";

  if (!story.sentences.length) {
    const empty = document.createElement("p");
    empty.className = "question-hint";
    empty.textContent = "Compila passaggi per vedere storia.";
    refs.previewSentences.appendChild(empty);
    return;
  }

  story.sentences.forEach((sentence, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = `story-sentence`;

    if (state.form.imageSpace !== "none") {
      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      placeholder.textContent = "Spazio immagine";
      wrapper.appendChild(placeholder);
    }

    const row = document.createElement("div");
    row.className = "sentence-row";

    const bar = document.createElement("span");
    bar.className = "sentence-type-bar";
    bar.dataset.type = sentence.type;

    const text = document.createElement("p");
    text.className = "sentence-text";
    text.textContent = `${index + 1}. ${sentence.text}`;

    row.appendChild(bar);
    row.appendChild(text);
    wrapper.appendChild(row);

    refs.previewSentences.appendChild(wrapper);
  });
}

function renderBalance(balance, counts) {
  if (balance.ok) {
    refs.balanceStatus.innerHTML =
      `<strong>Rapporto frasi OK.</strong><br>` +
      `Descrittive ${counts.descriptive}, Prospettiche ${counts.perspective}, ` +
      `Direttive ${counts.directive}, Affermative ${counts.affirmative}.`;
    return;
  }

  refs.balanceStatus.innerHTML =
    `<strong>Rapporto da migliorare</strong><br>${balance.notes.join("<br>")}`;
}

function renderLexicalWarnings() {
  const suggestions = collectLexicalSuggestions();
  if (!suggestions.length) {
    refs.lexicalWarnings.innerHTML =
      "<strong>Lessico semplice:</strong> nessuna semplificazione suggerita. Il testo resta quello che scrivi.";
    return;
  }

  const rows = suggestions
    .map((item) => `\u2022 ${item.word} -> ${item.suggestion}`)
    .join("<br>");

  refs.lexicalWarnings.innerHTML =
    `<strong>Semplificazioni suggerite (non applicate automaticamente):</strong><br>${rows}`;
}

function collectLexicalSuggestions() {
  const source = [
    state.form.situation,
    state.form.where,
    state.form.when,
    state.form.who,
    state.form.whatOthers,
    state.form.perspective,
    state.form.perspectiveExtra,
    state.form.directive,
    state.form.affirmativeCustom,
    state.form.title
  ]
    .filter(Boolean)
    .join(" ");

  const result = [];
  const seen = new Set();
  const seenWords = new Set();
  const { applicate } = applicaSostituzioni(source);

  for (const item of applicate) {
    const key = `${item.originale.toLowerCase()}=>${item.sostituito.toLowerCase()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    seenWords.add(item.originale.toLowerCase());
    result.push({ word: item.originale, suggestion: item.sostituito });
    if (result.length >= 10) {
      return result;
    }
  }

  const words = source.match(/[A-Za-zÀ-ÿ']+/g) || [];
  for (const word of words) {
    const lower = word.toLowerCase();
    if (lower.length <= 10 || seenWords.has(lower)) {
      continue;
    }

    const suggestion = SOSTITUZIONI_MAP.get(lower) || fallbackSimpleSuggestion(lower);
    seen.add(`${lower}=>${suggestion.toLowerCase()}`);
    seenWords.add(lower);
    result.push({
      word,
      suggestion
    });

    if (result.length >= 10) {
      break;
    }
  }

  return result;
}

function fallbackSimpleSuggestion(word) {
  if (word.endsWith("mente")) {
    return "bene";
  }
  if (word.endsWith("zione")) {
    return "idea";
  }
  if (word.endsWith("izzare")) {
    return "fare";
  }
  return "parola più corta";
}

function saveCurrentStory() {
  const directiveOk = updateDirectiveWarning();
  if (!directiveOk) {
    setStep(5);
    showToast("Correggi frase direttiva prima di salvare.", "error");
    return;
  }

  const story = buildStory();
  if (!story.sentences.length) {
    showToast("Compila almeno alcuni campi prima di salvare.", "error");
    return;
  }

  const now = new Date().toISOString();
  const existing = state.stories.find((item) => item.id === state.activeStoryId);
  const id = state.activeStoryId || makeId();

  const payload = {
    id,
    title: story.title,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
    steps: { ...state.form, title: story.title },
    text: story.text,
    counts: story.counts
  };

  state.form.title = story.title;

  if (existing) {
    state.stories = state.stories.map((item) => (item.id === id ? payload : item));
  } else {
    state.stories.push(payload);
  }

  state.activeStoryId = id;
  persistStories();
  renderHomeList();
  applyFormToUI();

  showToast("Storia salvata in archivio locale.", "success");
}

function openStory(storyId) {
  const story = state.stories.find((item) => item.id === storyId);
  if (!story) {
    return;
  }

  state.activeStoryId = story.id;
  state.form = {
    ...createDefaultForm(),
    ...story.steps,
    title: story.title || story.steps.title || ""
  };

  applyFormToUI();
  setStep(1);
  updatePreviewAndGuidance();
  showEditor();
}

async function deleteStory(storyId) {
  const story = state.stories.find((item) => item.id === storyId);
  if (!story) {
    return;
  }

  const ok = await showConfirmDialog(`Eliminare storia \"${story.title}\"?`);
  if (!ok) {
    return;
  }

  state.stories = state.stories.filter((item) => item.id !== storyId);
  if (state.activeStoryId === storyId) {
    state.activeStoryId = null;
    state.form = createDefaultForm();
    applyFormToUI();
    updatePreviewAndGuidance();
  }

  persistStories();
  renderHomeList();
  showToast("Storia eliminata.", "success");
}

function renderHomeList() {
  const sorted = [...state.stories].sort((a, b) => {
    const left = a.updatedAt || a.createdAt || "";
    const right = b.updatedAt || b.createdAt || "";
    return right.localeCompare(left);
  });

  refs.storiesList.innerHTML = "";
  refs.emptyState.style.display = sorted.length ? "none" : "block";

  sorted.forEach((story) => {
    const card = document.createElement("article");
    card.className = "story-card";

    const title = document.createElement("h3");
    title.textContent = story.title || "Storia senza titolo";

    const date = document.createElement("p");
    date.className = "story-date";
    date.textContent = formatDate(story.updatedAt || story.createdAt);

    const snippet = document.createElement("p");
    snippet.className = "story-snippet";
    snippet.textContent = clipText(story.text || "", 120);

    const actions = document.createElement("div");
    actions.className = "story-actions";

    const openBtn = document.createElement("button");
    openBtn.className = "btn";
    openBtn.type = "button";
    openBtn.dataset.action = "open";
    openBtn.dataset.id = story.id;
    openBtn.textContent = "Apri";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn";
    deleteBtn.type = "button";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = story.id;
    deleteBtn.textContent = "Elimina";

    actions.appendChild(openBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(snippet);
    card.appendChild(actions);

    refs.storiesList.appendChild(card);
  });
}

function copyStoryText() {
  const story = buildStory();
  const payload = `${story.title}\n\n${story.text}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(payload)
      .then(() => {
        showToast("Testo copiato.", "success");
      })
      .catch(() => {
        fallbackCopy(payload);
      });
    return;
  }

  fallbackCopy(payload);
}

function fallbackCopy(text) {
  let textarea = null;
  try {
    textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    if (!copied) {
      throw new Error("execCommand copy non riuscito");
    }
    showToast("Testo copiato.", "success");
  } catch (error) {
    showToast("Copia non riuscita. Seleziona testo manualmente.", "error");
  } finally {
    if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }
}

function ensureJsPdfLoaded() {
  if (window.jspdf && window.jspdf.jsPDF) {
    return Promise.resolve(true);
  }

  const existing = document.querySelector(`script[src="${JSPDF_CDN_URL}"]`);
  if (existing) {
    return new Promise((resolve) => {
      const done = () => resolve(Boolean(window.jspdf && window.jspdf.jsPDF));
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = JSPDF_CDN_URL;
    script.async = true;
    script.onload = () => resolve(Boolean(window.jspdf && window.jspdf.jsPDF));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function arrayBufferToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }

  return window.btoa(binary);
}

function loadPdfFontBase64() {
  if (pdfFontBase64Cache) {
    return Promise.resolve(pdfFontBase64Cache);
  }

  if (pdfFontLoadPromise) {
    return pdfFontLoadPromise;
  }

  pdfFontLoadPromise = (async () => {
    let lastError = null;

    for (const fontUrl of PDF_FONT_URLS) {
      try {
        const response = await fetch(fontUrl, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error(`Font HTTP ${response.status} (${fontUrl})`);
        }
        const buffer = await response.arrayBuffer();
        pdfFontBase64Cache = arrayBufferToBase64(buffer);
        return pdfFontBase64Cache;
      } catch (error) {
        lastError = error;
        console.warn("Tentativo caricamento font PDF fallito", fontUrl, error);
      }
    }

    throw lastError || new Error("Nessun font PDF disponibile.");
  })()
    .finally(() => {
      pdfFontLoadPromise = null;
    });

  return pdfFontLoadPromise;
}

async function ensurePdfUnicodeFont(doc) {
  try {
    const fontBase64 = await loadPdfFontBase64();
    doc.addFileToVFS(PDF_FONT_FILENAME, fontBase64);
    doc.addFont(PDF_FONT_FILENAME, PDF_FONT_FAMILY, "normal");
    doc.setFont(PDF_FONT_FAMILY, "normal");
    return true;
  } catch (error) {
    console.error("Impossibile caricare font PDF Unicode", error);
    return false;
  }
}

async function exportPDF() {
  const story = buildStory();
  if (!story.sentences.length) {
    showToast("Nessun testo da esportare.", "error");
    return;
  }

  const loaded = await ensureJsPdfLoaded();
  if (!loaded || !window.jspdf || !window.jspdf.jsPDF) {
    showToast("jsPDF non disponibile. Controlla connessione internet.", "error");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const unicodeFontReady = await ensurePdfUnicodeFont(doc);

  let y = 54;
  const marginLeft = 46;
  const maxY = 790;

  if (!unicodeFontReady) {
    doc.setFont("helvetica", "normal");
    showToast("PDF con font base: alcuni accenti potrebbero non vedersi bene.", "warning");
  }

  doc.setFontSize(19);
  doc.text(story.title, marginLeft, y);
  y += 28;

  doc.setFontSize(12);
  doc.text(
    `Descrittive ${story.counts.descriptive} | Prospettiche ${story.counts.perspective} | Direttive ${story.counts.directive} | Affermative ${story.counts.affirmative}`,
    marginLeft,
    y
  );
  y += 20;

  for (let i = 0; i < story.sentences.length; i += 1) {
    const sentence = story.sentences[i];
    const line = `${i + 1}. ${sentenceTypeLabel(sentence.type)}: ${sentence.text}`;

    if (state.form.imageSpace === "large") {
      y = ensurePage(doc, y, 118, maxY);
      doc.setDrawColor(153);
      doc.rect(marginLeft, y, 505, 72);
      y += 84;
      const lines = doc.splitTextToSize(line, 505);
      y = ensurePage(doc, y, lines.length * 16 + 12, maxY);
      doc.text(lines, marginLeft, y);
      y += lines.length * 16 + 8;
      continue;
    }

    if (state.form.imageSpace === "small") {
      const lines = doc.splitTextToSize(line, 395);
      const blockHeight = Math.max(lines.length * 16 + 10, 58);
      y = ensurePage(doc, y, blockHeight, maxY);
      doc.setDrawColor(153);
      doc.rect(marginLeft, y - 10, 90, 48);
      doc.text(lines, marginLeft + 105, y + 2);
      y += blockHeight;
      continue;
    }

    const lines = doc.splitTextToSize(line, 505);
    y = ensurePage(doc, y, lines.length * 16 + 8, maxY);
    doc.text(lines, marginLeft, y);
    y += lines.length * 16 + 6;
  }

  const filename = `${slugify(story.title || "storia-sociale")}.pdf`;
  doc.save(filename);
  showToast("PDF generato.", "success");
}

function getToastContainer() {
  let container = document.querySelector(".toast-container");
  if (container) {
    return container;
  }
  container = document.createElement("div");
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  const isUrgent = type === "error";
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", isUrgent ? "alert" : "status");
  toast.setAttribute("aria-live", isUrgent ? "assertive" : "polite");
  toast.setAttribute("aria-atomic", "true");
  toast.textContent = message;

  const container = getToastContainer();
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
    if (!container.children.length) {
      container.remove();
    }
  }, 3200);
}

function showConfirmDialog(message) {
  if (typeof HTMLDialogElement === "undefined") {
    return Promise.resolve(window.confirm(message));
  }

  return new Promise((resolve) => {
    const triggerElement = document.activeElement;
    const dialog = document.createElement("dialog");
    dialog.className = "app-dialog";
    dialog.innerHTML = `
      <p>${escapeHtml(message)}</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-secondary" data-action="cancel">Annulla</button>
        <button type="button" class="btn btn-primary" data-action="confirm">Elimina</button>
      </div>
    `;
    document.body.appendChild(dialog);

    const cleanup = (result) => {
      if (dialog.open) {
        dialog.close();
      }
      dialog.remove();
      if (triggerElement && typeof triggerElement.focus === "function") {
        triggerElement.focus();
      }
      resolve(result);
    };

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      cleanup(false);
    });

    dialog.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) {
        return;
      }
      cleanup(target.dataset.action === "confirm");
    });

    dialog.showModal();
    const firstButton = dialog.querySelector("button");
    if (firstButton) {
      firstButton.focus();
    }
  });
}

function announceStepChange() {
  if (!refs.stepAnnouncer) {
    return;
  }
  refs.stepAnnouncer.textContent = `Passo ${state.step} di ${STEP_TOTAL}`;
}

function ensurePage(doc, y, needHeight, maxY) {
  if (y + needHeight <= maxY) {
    return y;
  }
  doc.addPage();
  return 56;
}

function loadStories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      state.stories = [];
      return;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      state.stories = parsed;
      return;
    }

    if (parsed && Array.isArray(parsed.stories)) {
      state.stories = parsed.stories;
      return;
    }

    state.stories = [];
  } catch (error) {
    console.error("Errore lettura localStorage", error);
    state.stories = [];
  }
}

function persistStories() {
  const payload = {
    stories: state.stories
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function buildAutomaticTitle() {
  const situation = sanitize(state.form.situation);
  const name = sanitize(state.form.protagonistName);

  if (situation) {
    return `Storia: ${capitalize(clipText(situation, 40))}`;
  }

  if (name) {
    return `La storia di ${capitalize(name)}`;
  }

  return "Nuova storia sociale";
}

function sentenceTypeLabel(type) {
  const labels = {
    descriptive: "Descrittiva",
    perspective: "Prospettica",
    directive: "Direttiva",
    affirmative: "Affermativa"
  };
  return labels[type] || "Frase";
}

function sanitize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function capitalize(value) {
  const text = sanitize(value);
  if (!text) {
    return "";
  }
  return text[0].toUpperCase() + text.slice(1);
}

function lowercaseFirst(value) {
  const text = sanitize(value);
  if (!text) {
    return "";
  }
  return text[0].toLowerCase() + text.slice(1);
}

function clipText(text, maxLength) {
  const safe = sanitize(text);
  if (safe.length <= maxLength) {
    return safe;
  }
  return `${safe.slice(0, maxLength - 1)}…`;
}

function makeId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `story_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(isoString) {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function slugify(value) {
  return sanitize(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "storia-sociale";
}
