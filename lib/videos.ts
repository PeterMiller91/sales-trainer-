// Videos pro Lektion. Hinweis: Das sind Mitschnitte/Zusammenschnitte von Alex Hormozi
// auf Drittkanälen. Die ID (Teil nach "v=" in der YouTube-URL) kann hier jederzeit ersetzt werden.
export type Video = { id: string; title: string; channel: string };

export const lessonVideos: Record<string, Video> = {
  "einwand-vs-vorwand": { id: "lCfy1QeNvyY", title: "Alex Hormozi's $100M Objection Handling Strategies", channel: "The Chris Rigoudis" },
  "warum-menschen-nicht-kaufen": { id: "lsCyKqRCnMQ", title: "Alex Hormozi: „It's too expensive“ – Golden Objection Overcome", channel: "Derek Stupski" },
  "value-equation": { id: "8JwbbqtssRI", title: "The Value Equation in a Nutshell – Alex Hormozi", channel: "Young and Profiting" },
  "closer-framework": { id: "i-ZkqybSSqo", title: "Master the Art of Sales – Alex Hormozi CLOSER Framework", channel: "Peak Life Brandon" },
  "grundhaltung-einwandbehandlung": { id: "M5SuDAAif5A", title: "Alex Hormozi's 3 Rules For Closing Any Sale", channel: "The Founder Cut" },
  "vorwaende-aufdecken": { id: "b3cTCjSsFNQ", title: "The One Question That Stops „I Need to Think About It“", channel: "Shawn Casemore" },
};

export const hormoziSearch = (q: string) =>
  `https://www.youtube.com/@AlexHormozi/search?query=${encodeURIComponent(q)}`;
