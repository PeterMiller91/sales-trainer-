import { C, type Exercise } from "./exercises";

export type Category = "Umstände" | "Andere" | "Sich selbst";
export type Lever = "Traumergebnis" | "Wahrscheinlichkeit" | "Zeit" | "Aufwand";

export type Objection = {
  slug: string;
  quote: string;
  title: string;
  category: Category;
  lever: Lever;
  behind: string; // was wirklich dahintersteckt
  mistake: string; // typischer Fehler
  scripts: { name: string; text: string }[];
  exercise: Exercise;
};

export const objections: Objection[] = [
  {
    slug: "zu-teuer",
    quote: "Das ist mir zu teuer.",
    title: "Zu teuer",
    category: "Umstände",
    lever: "Traumergebnis",
    behind: "Fast nie das Geld selbst. Der Kunde sieht noch nicht, dass der Wert den Preis deutlich übersteigt, oder er zweifelt, dass es bei ihm funktioniert.",
    mistake: "Sofort Rabatt anbieten. Das sagt dem Kunden: Es war vorher nicht so viel wert.",
    scripts: [
      { name: "Wert gegen Preis", text: "Verstehe ich. Zu teuer im Vergleich wozu? Was kostet es Sie, wenn das Problem in einem Jahr immer noch da ist?" },
      { name: "Isolieren", text: "Mal angenommen, Geld wäre kein Thema: Wären Sie dann zu 100 % überzeugt, dass das für Sie das Richtige ist?" },
      { name: "Hormozi-Klassiker", text: "Ist es, dass es zu teuer ist, oder dass Sie nicht sicher sind, ob es sich für Sie lohnt? Denn das sind zwei verschiedene Dinge." },
    ],
    exercise: { id: "lib-teuer", situation: "„Das ist mir ehrlich gesagt zu teuer.“", task: "Finde heraus, ob es wirklich ums Geld geht.", checks: [C.anerkennen, C.isolieren, C.frage], model: "Verstehe ich, das ist eine echte Investition. Darf ich fragen: Ist es der Betrag an sich, oder sind Sie noch nicht sicher, ob es sich für Sie lohnt? Angenommen, Sie wüssten, dass es funktioniert, wäre der Preis dann noch ein Thema?" },
  },
  {
    slug: "kein-geld",
    quote: "Ich habe das Geld gerade nicht.",
    title: "Kein Geld",
    category: "Umstände",
    lever: "Traumergebnis",
    behind: "Manchmal echt, oft eine Frage der Priorität. Wer etwas wirklich will, findet häufig einen Weg (Ratenzahlung, Umschichten, Kredit).",
    mistake: "Den Kunden als „nicht kaufkräftig“ abhaken, ohne nach Möglichkeiten zu fragen.",
    scripts: [
      { name: "Ressourcen-Frage", text: "Verstehe ich. Wenn Sie wüssten, dass es Ihr Problem löst: Wie würden Sie es möglich machen?" },
      { name: "Priorität", text: "Ist es, dass das Geld gar nicht da ist, oder dass Sie es gerade für etwas anderes eingeplant haben?" },
      { name: "Ratenzahlung", text: "Wenn wir es in monatlichen Schritten machen, die sich schon im ersten Monat bezahlt machen, wäre das eine Option?" },
    ],
    exercise: { id: "lib-geld", situation: "„Ich habe das Geld einfach gerade nicht.“", task: "Kläre, ob es um Möglichkeit oder Priorität geht.", checks: [C.anerkennen, C.frage, C.warum], model: "Danke, dass Sie das offen sagen. Darf ich fragen: Ist das Geld wirklich nicht da, oder ist es gerade für etwas anderes eingeplant? Wenn Sie sicher wären, dass es Ihr Problem löst, wie würden Sie es möglich machen?" },
  },
  {
    slug: "keine-zeit",
    quote: "Dafür habe ich gerade keine Zeit.",
    title: "Keine Zeit",
    category: "Umstände",
    lever: "Aufwand",
    behind: "Der Kunde glaubt, die Lösung kostet ihn mehr Zeit und Kraft, als er hat. Genau deshalb hat er das Problem ja.",
    mistake: "Den Aufwand kleinreden, ohne konkret zu zeigen, wie wenig es wirklich ist.",
    scripts: [
      { name: "Umkehr", text: "Genau deshalb sprechen wir. Wenn Sie Zeit hätten, hätten Sie das Problem wahrscheinlich schon selbst gelöst, oder?" },
      { name: "Konkret machen", text: "Wie viel Zeit pro Woche könnten Sie realistisch reinstecken? Dann zeige ich Ihnen, wie es damit funktioniert." },
    ],
    exercise: { id: "lib-zeit", situation: "„Klingt gut, aber dafür habe ich gerade echt keine Zeit.“", task: "Dreh den Einwand um, ohne zu diskutieren.", checks: [C.anerkennen, C.frage, C.ergebnis], model: "Verstehe ich total. Genau deshalb sprechen wir ja: Wenn Sie die Zeit hätten, hätten Sie das längst selbst gelöst, oder? Wie viel Zeit pro Woche wäre realistisch? Dann zeige ich Ihnen, wie Sie damit Ihr Ziel erreichen." },
  },
  {
    slug: "nachdenken",
    quote: "Ich muss darüber nachdenken.",
    title: "Muss drüber nachdenken",
    category: "Sich selbst",
    lever: "Wahrscheinlichkeit",
    behind: "Fast immer ein Vorwand. Dahinter steckt ein konkreter Zweifel, den der Kunde nicht ausspricht: Preis, Vertrauen, Angst vor der Entscheidung.",
    mistake: "„Klar, melden Sie sich.“ Damit ist der Abschluss meistens weg.",
    scripts: [
      { name: "Was genau?", text: "Absolut. Worüber genau möchten Sie nachdenken? Vielleicht kann ich Ihnen gleich helfen." },
      { name: "Hormozi: Entscheidung", text: "Nachdenken heißt ja, Informationen zu bewerten. Welche Information fehlt Ihnen noch, um zu entscheiden?" },
      { name: "Worst Case", text: "Was ist das Schlimmste, das passieren könnte, wenn Sie heute Ja sagen?" },
    ],
    exercise: { id: "lib-nachdenken", situation: "„Okay, ich muss da nochmal drüber nachdenken.“", task: "Finde den konkreten Zweifel hinter dem Nachdenken.", checks: [C.anerkennen, C.warum, C.frage], model: "Absolut, das ist eine wichtige Entscheidung. Worüber genau möchten Sie nachdenken: eher das Programm selbst, den Preis oder ob es bei Ihnen funktioniert?" },
  },
  {
    slug: "partner",
    quote: "Das muss ich erst mit meinem Partner besprechen.",
    title: "Partner / Ehefrau / Ehemann",
    category: "Andere",
    lever: "Wahrscheinlichkeit",
    behind: "Manchmal echt, oft ein Schutzschild. Der Kunde ist selbst noch nicht überzeugt und schiebt die Entscheidung ab.",
    mistake: "Den Partner schlechtreden oder Druck machen, ohne die eigene Überzeugung des Kunden zu klären.",
    scripts: [
      { name: "Eigene Meinung", text: "Absolut sinnvoll. Mal angenommen, Ihr Partner sagt sofort Ja: Wären Sie selbst dann dabei?" },
      { name: "Vorbereiten", text: "Was glauben Sie, wird Ihr Partner fragen? Dann gehen wir das jetzt gemeinsam durch, damit Sie gut vorbereitet sind." },
      { name: "Gemeinsam", text: "Wollen wir Ihren Partner kurz dazuholen? Dann kann er seine Fragen direkt stellen." },
    ],
    exercise: { id: "lib-partner", situation: "„Das muss ich erst mit meiner Frau besprechen.“", task: "Kläre, ob der Kunde selbst überzeugt ist.", checks: [C.anerkennen, C.isolieren, C.frage], model: "Absolut, das ist eine Entscheidung für die Familie. Mal angenommen, Ihre Frau sagt sofort Ja: Wären Sie selbst zu 100 % dabei? Und was glauben Sie, wird sie fragen?" },
  },
  {
    slug: "chef",
    quote: "Das muss mein Chef entscheiden.",
    title: "Chef / Entscheider fehlt",
    category: "Andere",
    lever: "Wahrscheinlichkeit",
    behind: "Der Gesprächspartner hat keine Entscheidungsmacht oder will das Risiko nicht allein tragen.",
    mistake: "Das Gespräch einfach weiterführen, ohne den Entscheider einzubinden.",
    scripts: [
      { name: "Champion machen", text: "Verstehe ich. Wie würden Sie es Ihrem Chef empfehlen? Was wird ihm wichtig sein?" },
      { name: "Termin", text: "Macht es Sinn, dass wir zu dritt 20 Minuten sprechen? Dann muss nichts über Stille Post laufen." },
    ],
    exercise: { id: "lib-chef", situation: "„Ich finde es gut, aber das entscheidet mein Chef.“", task: "Mach den Kunden zu deinem Fürsprecher und hol den Entscheider dazu.", checks: [C.anerkennen, C.frage, C.abschluss], model: "Das verstehe ich gut. Was wird Ihrem Chef bei so einer Entscheidung am wichtigsten sein? Wollen wir einen kurzen Termin zu dritt machen, damit Sie nicht alles weitergeben müssen?" },
  },
  {
    slug: "hat-nie-funktioniert",
    quote: "Hat bei mir noch nie funktioniert.",
    title: "Hat noch nie funktioniert",
    category: "Sich selbst",
    lever: "Wahrscheinlichkeit",
    behind: "Schlechte Erfahrungen. Der Kunde glaubt nicht mehr daran, dass er das Ergebnis erreichen kann.",
    mistake: "Behaupten „Bei uns ist alles anders!“, ohne zu zeigen, warum.",
    scripts: [
      { name: "Ursache finden", text: "Danke, dass Sie das sagen. Was genau hat damals nicht funktioniert? Lag es an der Methode oder an der Begleitung?" },
      { name: "Unterschied zeigen", text: "Wenn wir genau diesen Punkt anders lösen, wäre das dann ein Grund, es nochmal zu versuchen?" },
    ],
    exercise: { id: "lib-nie", situation: "„Ich habe so was schon zweimal probiert. Hat bei mir nie funktioniert.“", task: "Finde heraus, woran es lag, und baue Vertrauen auf.", checks: [C.anerkennen, C.vergangenheit, C.frage], model: "Danke, dass Sie das so offen sagen. Woran ist es damals gescheitert? Lag es an der Methode oder daran, dass Sie allein waren? Wenn wir genau das anders machen, wäre es dann einen Versuch wert?" },
  },
  {
    slug: "schaffe-ich-nicht",
    quote: "Ich weiß nicht, ob ich das schaffe.",
    title: "Selbstzweifel",
    category: "Sich selbst",
    lever: "Aufwand",
    behind: "Angst vor dem Scheitern. Der Kunde traut sich die Umsetzung nicht zu.",
    mistake: "„Das schaffen Sie schon!“ Leere Ermutigung ohne Plan.",
    scripts: [
      { name: "Weg zeigen", text: "Völlig normal, das denken fast alle am Anfang. Was genau macht Ihnen Sorgen? Dann zeige ich Ihnen den ersten Schritt." },
      { name: "Beweis", text: "Viele unserer Kunden hatten genau dieselbe Sorge. Was würde Ihnen helfen, sicherer zu sein?" },
    ],
    exercise: { id: "lib-schaffe", situation: "„Ich weiß nicht, ob ich das wirklich durchziehe.“", task: "Nimm die Angst, indem du den Weg einfach machst.", checks: [C.anerkennen, C.warum, C.frage], model: "Das ist völlig normal, das denken fast alle am Anfang. Was genau macht Ihnen Sorgen, die Zeit oder die Umsetzung? Dann zeige ich Ihnen, wie der erste Schritt ganz einfach aussieht." },
  },
  {
    slug: "konkurrenz",
    quote: "Ich habe ein günstigeres Angebot.",
    title: "Konkurrenz ist günstiger",
    category: "Umstände",
    lever: "Wahrscheinlichkeit",
    behind: "Der Kunde vergleicht Preise, weil er den Unterschied im Ergebnis nicht sieht.",
    mistake: "Die Konkurrenz schlechtmachen oder sofort im Preis mitgehen.",
    scripts: [
      { name: "Vergleich", text: "Gut, dass Sie vergleichen. Was genau bekommen Sie dort, und was ist Ihnen am wichtigsten am Ergebnis?" },
      { name: "Warum noch hier", text: "Darf ich fragen: Wenn das andere Angebot perfekt wäre, warum sprechen wir dann noch?" },
    ],
    exercise: { id: "lib-konkurrenz", situation: "„Bei der Konkurrenz bekomme ich das für die Hälfte.“", task: "Bleib ruhig und lenk auf das Ergebnis statt auf den Preis.", checks: [C.anerkennen, C.frage, C.ergebnis, C.kein_widerspruch], model: "Gut, dass Sie vergleichen, das würde ich auch machen. Darf ich fragen: Wenn das andere Angebot perfekt wäre, warum sprechen wir dann noch? Was ist Ihnen beim Ergebnis am wichtigsten?" },
  },
  {
    slug: "spaeter",
    quote: "Lass uns das nächstes Jahr machen.",
    title: "Später / Nicht jetzt",
    category: "Umstände",
    lever: "Zeit",
    behind: "Aufschieben fühlt sich sicher an. Das Problem kostet aber jeden Monat weiter Geld, Zeit oder Nerven.",
    mistake: "Den Termin einfach in den Kalender schreiben und hoffen.",
    scripts: [
      { name: "Kosten des Wartens", text: "Verstehe ich. Was kostet es Sie, wenn Sie das Problem noch 12 Monate haben?" },
      { name: "Was ändert sich?", text: "Was wäre denn nächstes Jahr anders als heute?" },
    ],
    exercise: { id: "lib-spaeter", situation: "„Lass uns das lieber nächstes Jahr angehen.“", task: "Zeig die Kosten des Wartens, ohne Druck.", checks: [C.anerkennen, C.frage, C.warum], model: "Verstehe ich. Darf ich fragen, was nächstes Jahr anders wäre als heute? Und was kostet es Sie, wenn das Problem noch 12 Monate bleibt?" },
  },
];

export type Pretext = {
  slug: string;
  quote: string;
  realReasons: string[];
  questions: string[];
};

export const pretexts: Pretext[] = [
  { slug: "infos", quote: "Schicken Sie mir mal Infos.", realReasons: ["Will das Gespräch höflich beenden", "Ist vom Wert nicht überzeugt", "Zweifelt am Preis"], questions: ["Mache ich gern. Was genau müssten Sie sehen, um eine Entscheidung treffen zu können?", "Damit ich nicht irgendwas schicke: Was ist Ihnen am wichtigsten?"] },
  { slug: "kein-interesse", quote: "Kein Interesse.", realReasons: ["Schlechte Erfahrung mit Verkäufern", "Kennt den Nutzen nicht", "Gerade gestresst"], questions: ["Völlig okay. Darf ich fragen, ob es am Thema liegt oder einfach am Zeitpunkt?", "Verstehe ich. Was müsste passieren, damit es für Sie interessant wäre?"] },
  { slug: "schlechter-zeitpunkt", quote: "Gerade ist ein schlechter Zeitpunkt.", realReasons: ["Unsicher über den Nutzen", "Angst vor der Entscheidung", "Andere Prioritäten"], questions: ["Wann wäre denn ein guter Zeitpunkt, und was wäre dann anders als heute?", "Ist es der Zeitpunkt, oder gibt es noch etwas anderes, das Sie zögern lässt?"] },
  { slug: "melde-mich", quote: "Ich melde mich bei Ihnen.", realReasons: ["Will Nein sagen, ohne Nein zu sagen", "Hat noch einen offenen Zweifel"], questions: ["Gern. Damit ich weiß, woran ich bin: Auf einer Skala von 1 bis 10, wie wahrscheinlich ist ein Ja?", "Was müsste passieren, damit es eine 10 wird?"] },
  { slug: "schon-anbieter", quote: "Wir haben schon jemanden dafür.", realReasons: ["Bequemlichkeit, Wechsel ist Aufwand", "Will nicht illoyal sein", "Ist eigentlich unzufrieden"], questions: ["Super. Was gefällt Ihnen dort am besten, und was würden Sie sich noch wünschen?", "Wenn Sie eine Sache verbessern könnten, welche wäre das?"] },
  { slug: "angebot-vergleichen", quote: "Ich hole noch andere Angebote ein.", realReasons: ["Unsicherheit beim Preis", "Kein Vertrauen in die Entscheidung", "Will verhandeln"], questions: ["Absolut sinnvoll. Woran werden Sie die Angebote vergleichen?", "Was müsste ein Angebot haben, damit Sie sofort Ja sagen?"] },
  { slug: "nicht-budget", quote: "Das ist nicht im Budget.", realReasons: ["Keine Priorität", "Entscheider nicht überzeugt", "Wert nicht klar"], questions: ["Verstehe ich. Wenn es im Budget wäre, wäre es dann die richtige Lösung?", "Wie werden bei Ihnen Budgets für Dinge freigegeben, die sich selbst bezahlen?"] },
  { slug: "website-anschauen", quote: "Ich schaue mir erst mal Ihre Website an.", realReasons: ["Will Zeit gewinnen", "Vertraut noch nicht", "Hat eine Frage, die er nicht stellt"], questions: ["Gern. Was erhoffen Sie sich dort zu finden? Vielleicht kann ich es direkt beantworten.", "Gibt es etwas, bei dem Sie noch unsicher sind?"] },
];

/** „Einwand oder Vorwand?“-Spiel. type = was es meistens ist. */
export const detectorItems: { text: string; type: "Einwand" | "Vorwand"; why: string }[] = [
  { text: "„Ich habe diesen Monat nur 500 € frei, das Programm kostet 1.500 €.“", type: "Einwand", why: "Konkret und lösbar, z. B. mit Ratenzahlung." },
  { text: "„Schicken Sie mir einfach mal Infos.“", type: "Vorwand", why: "Beendet das Gespräch, ohne einen Grund zu nennen." },
  { text: "„Ich muss darüber nachdenken.“", type: "Vorwand", why: "Vage. Dahinter steckt ein unausgesprochener Zweifel." },
  { text: "„Ich habe Angst, dass ich nach zwei Wochen wieder aufhöre, wie letztes Mal.“", type: "Einwand", why: "Ehrlich und konkret: Der Kunde nennt sein echtes Problem." },
  { text: "„Gerade ist es irgendwie schlecht.“", type: "Vorwand", why: "Kein konkreter Grund, kein Zeitpunkt." },
  { text: "„Wir haben einen Vertrag mit der Konkurrenz bis Ende März.“", type: "Einwand", why: "Echter Umstand mit klarem Datum." },
  { text: "„Kein Interesse.“", type: "Vorwand", why: "Reflex-Antwort, bevor der Nutzen überhaupt klar ist." },
  { text: "„Ich kann nur abends nach 20 Uhr, geht das?“", type: "Einwand", why: "Konkrete Bedingung, eigentlich schon fast ein Ja." },
  { text: "„Ich melde mich.“", type: "Vorwand", why: "Höfliches Nein ohne Begründung." },
  { text: "„Mein Chef muss das freigeben, er ist bis Freitag im Urlaub.“", type: "Einwand", why: "Klarer Entscheider und klarer Zeitpunkt." },
  { text: "„Ich hole noch ein paar andere Angebote ein.“", type: "Vorwand", why: "Meistens Unsicherheit beim Wert oder beim Preis." },
  { text: "„Funktioniert das auch, wenn ich keine eigene Website habe?“", type: "Einwand", why: "Echte Frage: Der Kunde denkt schon über die Umsetzung nach." },
];

export function getObjection(slug: string) {
  return objections.find((o) => o.slug === slug);
}

/** Karteikarten: aus Einwänden und Vorwänden. */
export type Card = { id: string; front: string; back: string; tag: string };
export const cards: Card[] = [
  ...objections.map((o) => ({ id: `o-${o.slug}`, front: o.quote, back: o.scripts[0].text, tag: o.category })),
  ...objections.filter((o) => o.scripts[1]).map((o) => ({ id: `o2-${o.slug}`, front: o.quote, back: o.scripts[1].text, tag: o.category })),
  ...pretexts.map((p) => ({ id: `p-${p.slug}`, front: p.quote, back: p.questions[0], tag: "Vorwand" })),
  { id: "t-closer", front: "Wofür steht CLOSER?", back: "Clarify, Label, Overview, Sell the Vacation, Explain away concerns, Reinforce.", tag: "Theorie" },
  { id: "t-value", front: "Wie lautet Hormozis Value Equation?", back: "(Traumergebnis × Wahrscheinlichkeit) ÷ (Zeit bis zum Ergebnis × Aufwand)", tag: "Theorie" },
  { id: "t-blame", front: "Auf welche drei Dinge schieben Kunden ihr Nein?", back: "Umstände (Zeit, Geld), andere Menschen (Partner, Chef) und sich selbst (Zweifel).", tag: "Theorie" },
  { id: "t-struktur", front: "Die 5 Schritte jeder Einwandbehandlung?", back: "Anerkennen, nachfragen, isolieren, lösen, Abschlussfrage.", tag: "Theorie" },
];
