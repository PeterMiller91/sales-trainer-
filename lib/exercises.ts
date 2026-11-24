// Freitext-Übungen. Die automatische Prüfung ist eine einfache Stichwort-Heuristik
// (Phase 3 ersetzt sie durch KI-Feedback). Jede Prüfung gilt als erfüllt,
// wenn eines der Muster im Text vorkommt.

export type Check = { label: string; patterns: RegExp[] };

export type Exercise = {
  id: string;
  situation: string; // Was der Kunde sagt / Kontext
  task: string; // Was du tun sollst
  checks: Check[];
  model: string; // Musterantwort
  tip?: string;
};

export const C = {
  frage: { label: "Du stellst eine Frage", patterns: [/\?/] },
  anerkennen: {
    label: "Du erkennst das Gefühl des Kunden an",
    patterns: [/versteh/i, /nachvollzieh/i, /verständlich/i, /absolut/i, /total/i, /klar\b/i, /danke/i, /fair/i, /gute frage/i, /kenn(e|en) ich/i, /macht sinn/i, /gerne?\b/i, /kenne(n)? viele/i],
  },
  kein_widerspruch: {
    label: "Du widersprichst nicht direkt",
    patterns: [/^(?![\s\S]*\b(doch|falsch|stimmt nicht|das ist nicht richtig|da irren sie)\b)[\s\S]+$/i],
  },
  isolieren: {
    label: "Du klärst, ob es der einzige Punkt ist",
    patterns: [/einzig/i, /sonst noch/i, /außer(dem)?/i, /noch etwas/i, /noch was/i, /angenommen/i, /wenn .*(gelöst|geklärt|kein thema|keine rolle)/i],
  },
  ergebnis: {
    label: "Du sprichst über das Ergebnis / Ziel des Kunden",
    patterns: [/ziel/i, /ergebnis/i, /stell(en)? (dir|sie sich) vor/i, /in \d+ (wochen|monaten|tagen)/i, /wie würde/i, /wie fühlt/i, /was würde sich ändern/i, /erreich/i, /\b(willst|wollen|möchtest|möchten)\b/i],
  },
  du_sie: { label: "Du sprichst den Kunden direkt an", patterns: [/\b(sie|ihnen|ihr|du|dir|dein)\b/i] },
  warum: {
    label: "Du fragst nach dem Grund oder Auslöser",
    patterns: [/warum/i, /wieso/i, /was hat .*gebracht/i, /was .*(dazu )?bewegt/i, /wodurch/i, /weshalb/i, /was genau/i, /was ist passiert/i, /auslöser/i, /woran/i, /was war/i],
  },
  vergangenheit: {
    label: "Du fragst nach bisherigen Versuchen",
    patterns: [/(schon|bisher|bereits) .*(probiert|versucht|gemacht|getestet)/i, /was hat .*(nicht )?funktioniert/i, /früher/i, /bisher/i, /abgebrochen/i, /gescheitert/i, /woran/i],
  },
  bestaetigen: {
    label: "Du lässt den Kunden bestätigen",
    patterns: [/richtig\?/i, /stimmt('?s| das)?\?/i, /korrekt\?/i, /oder\?/i, /habe ich (das|sie) richtig/i, /sehe ich das richtig/i, /passt das\?/i],
  },
  abschluss: {
    label: "Du führst zur Entscheidung / zum nächsten Schritt",
    patterns: [/starten/i, /loslegen/i, /anfangen/i, /dabei/i, /entscheid/i, /nächste(n)? schritt/i, /unterschreib/i, /einsteigen/i, /machen wir/i, /bereit/i],
  },
  bestaerken: {
    label: "Du bestärkst die Entscheidung",
    patterns: [/richtige (entscheidung|wahl)/i, /glückwunsch/i, /gratul/i, /stolz/i, /freu/i, /(starke|gute|kluge|richtige|super) (entscheidung|wahl)/i],
  },
  naechste_schritte: {
    label: "Du erklärst, was als Nächstes passiert",
    patterns: [/als nächstes/i, /nächste(n)? schritt/i, /morgen/i, /heute noch/i, /bekommen sie/i, /bekommst du/i, /erhalten sie/i, /innerhalb/i, /dann/i],
  },
  ehrlich: {
    label: "Du nimmst Druck raus / erlaubst ein Nein",
    patterns: [/okay,? wenn/i, /völlig (ok|okay|in ordnung)/i, /ehrlich/i, /kein problem/i, /nicht (das )?richtige für/i, /offen/i],
  },
  skala: { label: "Du nutzt eine Skala oder konkrete Zahl", patterns: [/skala/i, /1 bis 10/i, /von 1/i, /\b10\b/] },
} satisfies Record<string, Check>;

export function evaluate(text: string, checks: Check[]) {
  return checks.map((c) => ({ label: c.label, ok: c.patterns.some((p) => p.test(text)) }));
}

/** Eine Praxis-Aufgabe am Ende jeder Lektion, Schlüssel = Lektions-Slug. */
export const lessonExercises: Record<string, Exercise> = {
  "einwand-vs-vorwand": {
    id: "l1",
    situation: "„Das ist mir gerade zu teuer.“",
    task: "Schreib eine Antwort, mit der du testest, ob das ein echter Einwand oder ein Vorwand ist.",
    checks: [C.anerkennen, C.isolieren, C.frage],
    model: "Verstehe ich, das ist eine Investition. Mal angenommen, Geld wäre kein Thema: Wären Sie dann zu 100 % überzeugt, dass das für Sie das Richtige ist?",
    tip: "Der Lösungstest: „Angenommen, das wäre gelöst …“",
  },
  "warum-menschen-nicht-kaufen": {
    id: "l2",
    situation: "„Ich weiß nicht, ob ich das wirklich durchziehe. Ich habe schon so viel angefangen.“",
    task: "In welche Kategorie fällt das (Umstände, Andere, Sich selbst)? Schreib eine Antwort, die Vertrauen aufbaut.",
    checks: [C.anerkennen, C.vergangenheit, C.frage],
    model: "Danke, dass Sie das so offen sagen, das kennen viele. Was war bei den Dingen, die Sie abgebrochen haben, der Grund? Lag es an Ihnen oder daran, dass Sie allein waren und niemand Sie begleitet hat?",
    tip: "Kategorie „Sich selbst“: Zweifel an der eigenen Umsetzung. Zeig, dass es diesmal anders ist.",
  },
  "value-equation": {
    id: "l3",
    situation: "„Das dauert mir alles zu lange, bis ich da Ergebnisse sehe.“",
    task: "Welcher Hebel der Value Equation ist betroffen? Formuliere eine Antwort, die genau diesen Hebel verbessert.",
    checks: [C.anerkennen, C.ergebnis, C.frage],
    model: "Absolut verständlich, niemand will ewig warten. Die meisten sehen schon in den ersten 14 Tagen das erste Ergebnis, weil wir mit dem schnellsten Hebel starten. Wäre so ein erster Erfolg in zwei Wochen für Sie ein guter Anfang?",
    tip: "Betroffen ist „Zeit bis zum Ergebnis“: Zeig einen schnellen ersten Erfolg.",
  },
  "closer-framework": {
    id: "l4",
    situation: "Ein Interessent für dein Coaching ist gerade ins Gespräch gekommen.",
    task: "Schreib deine Eröffnungsfrage für den Schritt „Clarify“.",
    checks: [C.warum, C.frage, C.du_sie],
    model: "Schön, dass Sie da sind. Bevor ich etwas erzähle: Was hat Sie dazu gebracht, sich gerade jetzt bei uns zu melden?",
    tip: "Der Kunde soll selbst aussprechen, warum er hier ist.",
  },
  "grundhaltung-einwandbehandlung": {
    id: "l5",
    situation: "„Das funktioniert in meiner Branche nicht.“",
    task: "Antworte nach der Grundstruktur: anerkennen, nachfragen, isolieren.",
    checks: [C.anerkennen, C.warum, C.isolieren, C.kein_widerspruch],
    model: "Verstehe ich, jede Branche hat ihre Besonderheiten. Was genau lässt Sie vermuten, dass es bei Ihnen anders ist? Und angenommen, wir finden darauf eine gute Antwort, gäbe es dann noch etwas, das Sie zurückhält?",
  },
  "vorwaende-aufdecken": {
    id: "l6",
    situation: "„Schicken Sie mir einfach mal ein paar Infos per Mail.“",
    task: "Deck den Vorwand auf, ohne Druck zu machen.",
    checks: [C.ehrlich, C.frage, C.warum],
    model: "Mache ich gern. Damit ich Ihnen nicht einfach irgendwas schicke: Was genau müssten Sie sehen, um eine Entscheidung treffen zu können? Und ganz ehrlich, es ist völlig okay, wenn das gerade nichts für Sie ist.",
  },
};

/** CLOSER-Praxis: ganze Gespräche, Schritt für Schritt selbst formuliert. */
export type Scenario = {
  slug: string;
  title: string;
  persona: string;
  emoji: string;
  steps: (Exercise & { step: "C" | "L" | "O" | "S" | "E" | "R"; stepName: string })[];
};

export const scenarios: Scenario[] = [
  {
    slug: "fitness-coaching",
    title: "Fitness-Coaching",
    emoji: "🏋️",
    persona: "Markus, 38, Vertriebsleiter. Hat 15 kg zu viel, wenig Zeit, zwei Kinder. Hat sich über eine Anzeige für ein Erstgespräch eingetragen. Das Coaching kostet 1.500 €.",
    steps: [
      { id: "fc-c", step: "C", stepName: "Clarify", situation: "Markus: „Hi, ja, ich habe mich bei euch eingetragen …“", task: "Finde heraus, warum Markus gerade JETZT mit dir spricht.", checks: [C.warum, C.frage], model: "Schön, dass es klappt, Markus. Erzähl mal: Was ist passiert, dass du dich gerade jetzt eingetragen hast?" },
      { id: "fc-l", step: "L", stepName: "Label", situation: "Markus: „Ich habe beim Kinderfest gemerkt, dass ich nach 10 Minuten Fußball außer Puste war. Und die Hemden spannen.“", task: "Fasse sein Problem und sein Ziel in einem Satz zusammen und lass es bestätigen.", checks: [C.ergebnis, C.bestaetigen], model: "Du willst also wieder fit genug sein, um mit deinen Kindern zu toben, und dich in deinen Hemden wohlfühlen, aber dein Job frisst gerade die ganze Zeit. Richtig?" },
      { id: "fc-o", step: "O", stepName: "Overview", situation: "Markus: „Genau so ist es.“", task: "Frag nach seinen bisherigen Versuchen und warum sie nicht geklappt haben.", checks: [C.vergangenheit, C.warum, C.frage], model: "Was hast du bisher schon probiert, und woran ist es jeweils gescheitert?" },
      { id: "fc-s", step: "S", stepName: "Sell the Vacation", situation: "Markus: „Fitnessstudio, zwei Diäten. Nach drei Wochen kam immer was dazwischen.“", task: "Verkaufe das Ergebnis, nicht den Prozess: Male ihm das Bild nach dem Coaching.", checks: [C.ergebnis, C.du_sie], model: "Stell dir vor, es ist Sommer, du spielst eine Stunde mit deinen Kindern Fußball und bist danach nicht platt, sondern hast Lust auf mehr. Und das mit 3 kurzen Einheiten pro Woche, die in deinen Kalender passen." },
      { id: "fc-e", step: "E", stepName: "Explain away concerns", situation: "Markus: „Klingt gut. Aber 1.500 € … ich muss da erst mal mit meiner Frau drüber reden.“", task: "Behandle den Einwand: anerkennen, nachfragen, isolieren.", checks: [C.anerkennen, C.isolieren, C.frage, C.kein_widerspruch], model: "Absolut, das ist eine Entscheidung für die Familie. Mal angenommen, deine Frau sagt sofort Ja: Wärst du selbst dann zu 100 % dabei? Und was glaubst du, wird sie fragen? Dann schauen wir das jetzt gemeinsam an." },
      { id: "fc-r", step: "R", stepName: "Reinforce", situation: "Markus: „Okay. Ich mache es. Wir starten.“", task: "Bestärke seine Entscheidung und sag, was als Nächstes passiert.", checks: [C.bestaerken, C.naechste_schritte], model: "Starke Entscheidung, Markus, deine Kinder werden es merken. Als Nächstes bekommst du heute noch den Zugang zur App, und morgen machen wir dein Kick-off-Gespräch." },
    ],
  },
  {
    slug: "b2b-software",
    title: "B2B-Software",
    emoji: "💼",
    persona: "Sabine, Geschäftsführerin einer Handwerksfirma mit 25 Leuten. Angebote und Rechnungen laufen noch über Excel. Deine Software kostet 249 € pro Monat.",
    steps: [
      { id: "b2b-c", step: "C", stepName: "Clarify", situation: "Sabine: „Ich habe nur 20 Minuten, also legen Sie los.“", task: "Bleib ruhig und lass Sabine erzählen, warum sie den Termin gebucht hat.", checks: [C.warum, C.frage], model: "Gern, ich halte es kurz. Damit ich nur zeige, was für Sie relevant ist: Was war der Auslöser, diesen Termin zu buchen?" },
      { id: "b2b-l", step: "L", stepName: "Label", situation: "Sabine: „Letzte Woche ist ein Angebot über 40.000 € liegen geblieben, weil keiner wusste, wer zuständig ist.“", task: "Benenne das Problem klar und lass es bestätigen.", checks: [C.ergebnis, C.bestaetigen], model: "Sie wollen also, dass kein Angebot mehr durchrutscht und jeder weiß, wer dran ist, aber mit Excel fehlt Ihnen der Überblick. Sehe ich das richtig?" },
      { id: "b2b-o", step: "O", stepName: "Overview", situation: "Sabine: „Ja, genau.“", task: "Frag nach bisherigen Lösungsversuchen.", checks: [C.vergangenheit, C.frage], model: "Was haben Sie bisher versucht, um das in den Griff zu bekommen, und warum hat es nicht gereicht?" },
      { id: "b2b-s", step: "S", stepName: "Sell the Vacation", situation: "Sabine: „Wir hatten mal eine andere Software, aber die war zu kompliziert. Keiner hat sie genutzt.“", task: "Beschreib, wie ihr Alltag in drei Monaten aussieht.", checks: [C.ergebnis, C.du_sie], model: "Stellen Sie sich vor: Montagmorgen öffnen Sie eine Seite und sehen alle offenen Angebote, wer zuständig ist und was diese Woche reinkommt. Kein Suchen, kein Nachfragen, kein Auftrag geht mehr verloren." },
      { id: "b2b-e", step: "E", stepName: "Explain away concerns", situation: "Sabine: „Schicken Sie mir mal ein Angebot, ich schaue es mir in Ruhe an.“", task: "Erkenne den Vorwand und finde den echten Grund.", checks: [C.anerkennen, C.ehrlich, C.frage], model: "Mache ich gern. Ganz ehrlich gefragt: Was müsste in dem Angebot stehen, damit Sie Ja sagen? Ist es der Preis, oder eher die Sorge, dass es wieder keiner nutzt?" },
      { id: "b2b-r", step: "R", stepName: "Reinforce", situation: "Sabine: „Gut, wir testen es mit dem Büro-Team.“", task: "Bestärke die Entscheidung und gib klare nächste Schritte.", checks: [C.bestaerken, C.naechste_schritte], model: "Sehr gute Entscheidung, das Büro-Team merkt den Unterschied schon in der ersten Woche. Als Nächstes richte ich heute noch Ihren Zugang ein, und am Donnerstag machen wir 30 Minuten Einführung mit dem Team." },
    ],
  },
];

export function getScenario(slug: string) {
  return scenarios.find((s) => s.slug === slug);
}
