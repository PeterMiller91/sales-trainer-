export type Block =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "merksatz"; text: string }
  | { type: "dialog"; lines: { who: "Kunde" | "Du"; text: string }[] };

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  blocks: Block[];
  quiz: QuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    slug: "einwand-vs-vorwand",
    number: 1,
    title: "Einwand vs. Vorwand",
    summary: "Der wichtigste Unterschied im Verkauf: echte Bedenken oder Ausrede?",
    minutes: 6,
    blocks: [
      { type: "p", text: "Wenn ein Kunde „Nein“ oder „Noch nicht“ sagt, gibt es zwei völlig verschiedene Situationen. Wer sie verwechselt, verliert den Abschluss." },
      { type: "h", text: "Der Einwand" },
      { type: "p", text: "Ein **Einwand** ist ein echtes Bedenken. Der Kunde will eigentlich, aber etwas steht im Weg: das Geld ist knapp, er zweifelt, ob es bei ihm funktioniert, oder der Zeitpunkt passt wirklich nicht. Ein Einwand ist im Kern eine **Frage**: „Hilf mir, das zu lösen, dann kaufe ich.“" },
      { type: "h", text: "Der Vorwand" },
      { type: "p", text: "Ein **Vorwand** ist eine Ausrede. Er schützt den Kunden davor, den echten Grund auszusprechen, oder davor, eine Entscheidung treffen zu müssen. Typisch: „Schicken Sie mir mal Infos“, „Ich muss darüber nachdenken“, „Gerade ist es schlecht“." },
      { type: "h", text: "Woran du den Unterschied erkennst" },
      { type: "list", items: [
        "**Lösungstest:** Frag „Angenommen, wir lösen das, wären Sie dann dabei?“ Bei einem Einwand kommt ein Ja. Bei einem Vorwand kommt sofort der nächste Grund.",
        "**Konkretheit:** Einwände sind konkret („Ich habe diesen Monat nur 500 € frei“). Vorwände bleiben vage („Ist gerade schwierig“).",
        "**Wechselnde Gründe:** Springt der Kunde von Grund zu Grund, ist keiner davon der echte.",
      ]},
      { type: "dialog", lines: [
        { who: "Kunde", text: "Das ist mir gerade zu teuer." },
        { who: "Du", text: "Verstehe ich. Mal angenommen, Geld wäre kein Thema, wären Sie dann zu 100 % überzeugt, dass das für Sie das Richtige ist?" },
        { who: "Kunde", text: "Ehrlich gesagt bin ich mir nicht sicher, ob ich das zeitlich umsetzen kann." },
        { who: "Du", text: "Danke für die Offenheit. Dann lassen Sie uns darüber sprechen, denn das ist der eigentliche Punkt." },
      ]},
      { type: "merksatz", text: "Einwände behandelst du. Vorwände deckst du auf. Erst wenn der echte Grund auf dem Tisch liegt, kannst du ihn lösen." },
    ],
    quiz: [
      { question: "Ein Kunde sagt: „Schicken Sie mir einfach mal ein paar Infos per Mail.“ Was ist das meistens?", options: ["Ein echter Einwand", "Ein Vorwand", "Eine Kaufzusage"], correct: 1, explanation: "„Schick mir Infos“ ist ein Klassiker unter den Vorwänden. Es beendet das Gespräch, ohne den echten Grund zu nennen." },
      { question: "Mit welcher Frage testest du, ob ein Einwand echt ist?", options: ["„Warum sagen Sie das?“", "„Angenommen, wir lösen das, wären Sie dann dabei?“", "„Sind Sie sicher?“"], correct: 1, explanation: "Der Lösungstest zeigt, ob hinter dem Grund noch ein anderer steckt. Kommt ein Ja, ist es ein echter Einwand." },
      { question: "Der Kunde nennt erst Geld, dann Zeit, dann seinen Partner. Was bedeutet das?", options: ["Er hat drei echte Einwände", "Keiner dieser Gründe ist wahrscheinlich der echte", "Er will auf jeden Fall kaufen"], correct: 1, explanation: "Wechselnde Gründe sind ein starkes Zeichen für Vorwände. Grab tiefer nach dem eigentlichen Zweifel." },
    ],
  },
  {
    slug: "warum-menschen-nicht-kaufen",
    number: 2,
    title: "Warum Menschen nicht kaufen",
    summary: "Hormozis Kernidee: Jedes Nein ist ein Mangel an wahrgenommenem Wert.",
    minutes: 7,
    blocks: [
      { type: "p", text: "Alex Hormozi bringt es auf den Punkt: Menschen kaufen, wenn der **wahrgenommene Wert** deutlich höher ist als der Preis. Jeder Einwand ist am Ende ein Zeichen, dass dieser Wert in ihrem Kopf noch nicht groß genug ist." },
      { type: "h", text: "Die drei Schuldigen" },
      { type: "p", text: "Laut Hormozi schieben Kunden die Schuld für ihr Nein fast immer auf eine von drei Ursachen:" },
      { type: "list", items: [
        "**Die Umstände:** „Kein Geld“, „Keine Zeit“, „Schlechter Zeitpunkt“.",
        "**Andere Menschen:** „Ich muss erst mit meinem Partner / Chef sprechen.“",
        "**Sich selbst:** „Ich weiß nicht, ob ich das schaffe“, „Bei mir hat noch nie etwas funktioniert.“",
      ]},
      { type: "p", text: "Wenn du weißt, in welche Kategorie ein Einwand fällt, weißt du auch, welche Strategie hilft. Bei Umständen geht es um Prioritäten, bei anderen Menschen um Verantwortung, bei sich selbst um Vertrauen." },
      { type: "h", text: "Es geht nie wirklich ums Geld" },
      { type: "p", text: "Fast jeder findet Geld für Dinge, die ihm wichtig genug sind. „Zu teuer“ heißt meistens: „Ich sehe noch nicht, dass es mir mehr bringt, als es kostet“ oder „Ich glaube nicht, dass es bei mir funktioniert.“" },
      { type: "merksatz", text: "Du verkaufst nicht gegen den Preis, du verkaufst gegen den Zweifel. Erhöhe den Wert, statt den Preis zu senken." },
    ],
    quiz: [
      { question: "„Ich muss erst mit meiner Frau reden.“ In welche Kategorie fällt das?", options: ["Umstände", "Andere Menschen", "Sich selbst"], correct: 1, explanation: "Der Kunde verlagert die Entscheidung auf eine andere Person." },
      { question: "Was steckt laut Hormozi meistens hinter „Das ist zu teuer“?", options: ["Der Kunde hat wirklich kein Geld", "Der wahrgenommene Wert ist noch zu niedrig", "Der Preis ist objektiv zu hoch"], correct: 1, explanation: "Ist der Wert in den Augen des Kunden größer als der Preis, findet er fast immer einen Weg." },
      { question: "„Ich glaube nicht, dass ich das durchziehe.“ Welche Kategorie?", options: ["Sich selbst", "Umstände", "Andere Menschen"], correct: 0, explanation: "Der Kunde zweifelt an sich selbst. Hier hilft es, Vertrauen aufzubauen und den Weg einfach zu machen." },
    ],
  },
  {
    slug: "value-equation",
    number: 3,
    title: "Die Value Equation",
    summary: "Die Formel, mit der du jeden Einwand auf seine Ursache zurückführst.",
    minutes: 6,
    blocks: [
      { type: "p", text: "Aus „$100M Offers“ stammt Hormozis Wertformel. Sie erklärt, warum ein Angebot attraktiv wirkt oder nicht:" },
      { type: "merksatz", text: "Wert = (Traumergebnis × Wahrscheinlichkeit, es zu erreichen) ÷ (Zeit bis zum Ergebnis × Aufwand und Opfer)" },
      { type: "h", text: "Die vier Hebel" },
      { type: "list", items: [
        "**Traumergebnis (nach oben):** Wie groß ist das Ziel, das der Kunde erreichen will?",
        "**Wahrscheinlichkeit (nach oben):** Wie sicher ist er, dass es bei ihm klappt? Beweise, Referenzen, Garantien.",
        "**Zeit (nach unten):** Wie schnell sieht er erste Ergebnisse?",
        "**Aufwand (nach unten):** Wie viel muss er selbst tun oder aufgeben?",
      ]},
      { type: "h", text: "So nutzt du die Formel bei Einwänden" },
      { type: "p", text: "Jeder Einwand greift einen der vier Hebel an. „Klappt bei mir nicht“ greift die Wahrscheinlichkeit an. „Dauert zu lange“ die Zeit. „Habe keine Zeit dafür“ den Aufwand. Finde den Hebel, dann weißt du, welches Argument hilft." },
      { type: "dialog", lines: [
        { who: "Kunde", text: "Ich habe einfach keine Zeit für so ein Programm." },
        { who: "Du", text: "Das hören wir oft. Genau deshalb dauert jede Einheit nur 15 Minuten, und das meiste machen wir für Sie. Wäre das machbar?" },
      ]},
    ],
    quiz: [
      { question: "Welche zwei Faktoren willst du so KLEIN wie möglich machen?", options: ["Traumergebnis und Wahrscheinlichkeit", "Zeit bis zum Ergebnis und Aufwand", "Preis und Traumergebnis"], correct: 1, explanation: "Zeit und Aufwand stehen unter dem Bruchstrich. Je kleiner sie sind, desto höher der Wert." },
      { question: "„Hat bei mir noch nie funktioniert.“ Welcher Hebel ist betroffen?", options: ["Wahrscheinlichkeit", "Zeit", "Traumergebnis"], correct: 0, explanation: "Der Kunde glaubt nicht, dass er das Ergebnis erreicht. Hier helfen Beweise und Garantien." },
      { question: "Was bewirkt eine starke Garantie in der Formel?", options: ["Sie senkt die Zeit", "Sie erhöht die wahrgenommene Wahrscheinlichkeit", "Sie erhöht das Traumergebnis"], correct: 1, explanation: "Eine Garantie nimmt das Risiko und macht den Erfolg für den Kunden glaubwürdiger." },
    ],
  },
  {
    slug: "closer-framework",
    number: 4,
    title: "Das CLOSER-Framework",
    summary: "Hormozis 6-Schritte-Gesprächsleitfaden für Verkaufsgespräche.",
    minutes: 9,
    blocks: [
      { type: "p", text: "CLOSER ist Hormozis Struktur für ein Verkaufsgespräch. Wer sie sauber durchläuft, bekommt deutlich weniger Einwände, weil die meisten schon vorher geklärt sind." },
      { type: "h", text: "C: Clarify (Klären)" },
      { type: "p", text: "Kläre, warum der Kunde hier ist. „Was hat Sie dazu gebracht, heute mit mir zu sprechen?“ Der Kunde soll sein Ziel selbst aussprechen." },
      { type: "h", text: "L: Label (Benennen)" },
      { type: "p", text: "Benenne sein Problem in klaren Worten und lass es bestätigen. „Sie wollen also X erreichen, aber Y hält Sie davon ab. Richtig?“" },
      { type: "h", text: "O: Overview (Rückblick)" },
      { type: "p", text: "Geh die bisherigen Versuche durch. „Was haben Sie schon probiert? Warum hat es nicht geklappt?“ So erkennt der Kunde selbst, dass der alte Weg nicht funktioniert." },
      { type: "h", text: "S: Sell the Vacation (Das Ziel verkaufen)" },
      { type: "p", text: "Verkaufe das Ergebnis, nicht den Prozess. Niemand kauft den Flug, alle kaufen den Urlaub. Beschreib, wie sein Leben aussieht, wenn das Problem gelöst ist." },
      { type: "h", text: "E: Explain away concerns (Bedenken auflösen)" },
      { type: "p", text: "Jetzt kommen die Einwände. Hör zu, frag nach dem echten Grund und löse ihn. Dafür trainierst du in dieser Plattform." },
      { type: "h", text: "R: Reinforce (Bestärken)" },
      { type: "p", text: "Nach dem Ja bestärkst du die Entscheidung. „Sie haben die richtige Wahl getroffen. Das passiert jetzt als Nächstes …“ So verhinderst du Kaufreue und Stornos." },
      { type: "merksatz", text: "Clarify, Label, Overview, Sell, Explain, Reinforce. Der Kunde redet am Anfang am meisten, du am Ende." },
    ],
    quiz: [
      { question: "Wofür steht das „S“ in CLOSER?", options: ["Sell the Vacation: das Ergebnis verkaufen", "Solve: das Problem lösen", "Signature: den Vertrag unterschreiben"], correct: 0, explanation: "Verkaufe den Urlaub, nicht den Flug. Menschen kaufen das Ergebnis." },
      { question: "In welchem Schritt sprichst du über frühere Versuche des Kunden?", options: ["Clarify", "Overview", "Reinforce"], correct: 1, explanation: "Im Overview blickt der Kunde zurück und erkennt, warum bisherige Wege nicht funktioniert haben." },
      { question: "Warum ist „Reinforce“ nach dem Abschluss wichtig?", options: ["Um noch mehr zu verkaufen", "Um Kaufreue und Stornos zu verhindern", "Es ist nicht wichtig"], correct: 1, explanation: "Wer seine Entscheidung bestätigt bekommt, bleibt dabei." },
      { question: "Wer sollte am Anfang des Gesprächs am meisten reden?", options: ["Du als Verkäufer", "Der Kunde", "Beide gleich viel"], correct: 1, explanation: "In Clarify und Label spricht der Kunde. Du stellst Fragen und hörst zu." },
    ],
  },
  {
    slug: "grundhaltung-einwandbehandlung",
    number: 5,
    title: "Die richtige Grundhaltung",
    summary: "Nie diskutieren: Wie du Einwände annimmst, statt sie zu bekämpfen.",
    minutes: 6,
    blocks: [
      { type: "p", text: "Der häufigste Fehler: Der Verkäufer hört einen Einwand und fängt an zu argumentieren. Der Kunde fühlt sich angegriffen und verteidigt seine Position. Jetzt geht es nicht mehr ums Produkt, sondern ums Rechthaben." },
      { type: "h", text: "Die drei Regeln" },
      { type: "list", items: [
        "**Zustimmen statt widersprechen:** „Das ist absolut verständlich.“ Du stimmst dem Gefühl zu, nicht der Schlussfolgerung.",
        "**Fragen statt behaupten:** Menschen glauben, was sie selbst sagen. Führe den Kunden mit Fragen zur Antwort.",
        "**Ruhig bleiben:** Ein Einwand ist kein Nein. Er ist ein Zeichen, dass der Kunde sich ernsthaft mit dem Kauf beschäftigt.",
      ]},
      { type: "h", text: "Die Grundstruktur jeder Antwort" },
      { type: "list", items: [
        "**1. Anerkennen:** „Verstehe ich total.“",
        "**2. Nachfragen:** „Darf ich fragen, was genau Ihnen dabei Sorgen macht?“",
        "**3. Isolieren:** „Ist das der einzige Punkt, oder gibt es noch etwas?“",
        "**4. Lösen:** Mit Fragen, Beispielen oder einem besseren Angebot.",
        "**5. Abschlussfrage:** „Wenn das geklärt ist, sollen wir starten?“",
      ]},
      { type: "dialog", lines: [
        { who: "Kunde", text: "Ich muss darüber nachdenken." },
        { who: "Du", text: "Absolut, das ist eine wichtige Entscheidung. Darf ich fragen, worüber genau Sie nachdenken möchten? Ist es eher das Programm selbst oder die Investition?" },
      ]},
      { type: "merksatz", text: "Wer diskutiert, verliert. Wer fragt, führt." },
    ],
    quiz: [
      { question: "Der Kunde sagt „Das funktioniert in meiner Branche nicht.“ Was ist die beste erste Reaktion?", options: ["„Doch, das funktioniert überall!“", "„Verstehe ich. Was lässt Sie das vermuten?“", "Sofort einen Rabatt anbieten"], correct: 1, explanation: "Erst anerkennen, dann nachfragen. Widerspruch erzeugt nur Gegenwehr." },
      { question: "Was bedeutet „Isolieren“?", options: ["Den Kunden unter Druck setzen", "Klären, ob es der einzige Einwand ist", "Das Thema wechseln"], correct: 1, explanation: "Nur wenn du weißt, dass es der einzige Punkt ist, führt die Lösung auch zum Abschluss." },
      { question: "Warum sind Fragen stärker als Behauptungen?", options: ["Weil sie höflicher klingen", "Weil Menschen glauben, was sie selbst sagen", "Weil sie das Gespräch verlängern"], correct: 1, explanation: "Eine Erkenntnis, die der Kunde selbst ausspricht, überzeugt ihn viel stärker als dein Argument." },
    ],
  },
  {
    slug: "vorwaende-aufdecken",
    number: 6,
    title: "Vorwände aufdecken",
    summary: "Fragetechniken, mit denen du zum echten Grund vordringst.",
    minutes: 7,
    blocks: [
      { type: "p", text: "Ein Vorwand lässt sich nicht „behandeln“, weil er nicht das eigentliche Problem ist. Wer auf „Schicken Sie mir Infos“ einfach Infos schickt, hört nie wieder etwas. Dein Ziel: den echten Grund freundlich ans Licht holen." },
      { type: "h", text: "Technik 1: Die Erlaubnis zum Nein" },
      { type: "p", text: "Nimm den Druck raus. „Es ist völlig okay, wenn das nichts für Sie ist. Sagen Sie mir einfach ehrlich, was Sie zurückhält.“ Wer Nein sagen darf, sagt eher die Wahrheit." },
      { type: "h", text: "Technik 2: Die Skala" },
      { type: "p", text: "„Auf einer Skala von 1 bis 10, wie sicher sind Sie, dass das für Sie passt?“ Bei einer 7 fragst du: „Was fehlt zur 10?“ Die Antwort ist der echte Einwand." },
      { type: "h", text: "Technik 3: Der Lösungstest" },
      { type: "p", text: "„Mal angenommen, [Vorwand] wäre kein Thema, würden Sie dann heute starten?“ Kommt ein Zögern, war der Vorwand nicht der Grund." },
      { type: "h", text: "Technik 4: Das Worst-Case-Szenario" },
      { type: "p", text: "Bei „Ich muss nachdenken“: „Was ist das Schlimmste, das passieren könnte, wenn Sie Ja sagen?“ So werden vage Sorgen konkret und lösbar." },
      { type: "dialog", lines: [
        { who: "Kunde", text: "Gerade ist einfach ein schlechter Zeitpunkt." },
        { who: "Du", text: "Verstehe. Wann wäre denn ein guter Zeitpunkt, und was wäre dann anders als heute?" },
        { who: "Kunde", text: "Hm, eigentlich nichts. Ich bin mir einfach unsicher, ob es sich lohnt." },
        { who: "Du", text: "Danke, dass Sie das so offen sagen. Lassen Sie uns genau das anschauen." },
      ]},
      { type: "merksatz", text: "Hinter jedem Vorwand steht ein Zweifel, den der Kunde nicht aussprechen will. Mach es ihm leicht, ihn auszusprechen." },
    ],
    quiz: [
      { question: "Der Kunde gibt eine 6 auf der Sicherheitsskala. Was fragst du?", options: ["„Warum nicht 10?“ oder „Was fehlt zur 10?“", "„Dann lassen wir es lieber.“", "„6 ist doch gut, also los!“"], correct: 0, explanation: "Die Lücke zur 10 ist genau der Punkt, den du lösen musst." },
      { question: "Warum hilft „Es ist okay, wenn das nichts für Sie ist“?", options: ["Es beendet das Gespräch schneller", "Es nimmt Druck raus, und der Kunde wird ehrlicher", "Es ist reine Höflichkeit"], correct: 1, explanation: "Unter Druck verteidigen sich Menschen mit Ausreden. Ohne Druck sagen sie die Wahrheit." },
      { question: "„Gerade ist schlechter Zeitpunkt.“ Welche Frage deckt den Vorwand am besten auf?", options: ["„Okay, ich melde mich in drei Monaten.“", "„Was wäre dann anders als heute?“", "„Das ist schade.“"], correct: 1, explanation: "Wenn sich später nichts ändert, liegt der echte Grund woanders." },
    ],
  },
];

export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug);
}
