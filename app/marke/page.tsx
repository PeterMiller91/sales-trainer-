import { LogoMark, Wordmark } from "@/components/Logo";

const colors = [
  { name: "Nachtblau", hex: "#0E1424", use: "Hintergrund, Ruhe, Seriosität" },
  { name: "Signal-Orange", hex: "#FF6B2C", use: "Aktion, Energie, Buttons" },
  { name: "Gold", hex: "#FFB547", use: "Merksätze, Erfolge" },
  { name: "Mint", hex: "#2ED39A", use: "Richtig, Fortschritt" },
  { name: "Papier", hex: "#F6F4EF", use: "Text" },
];

export default function Marke() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Die Marke</h1>
      <div className="mt-6 flex flex-col items-center rounded-3xl bg-night-2 p-8 text-center">
        <LogoMark size={88} />
        <Wordmark className="mt-4 text-4xl" />
        <p className="mt-2 text-muted">Verkaufen ohne Wenn und Aber.</p>
      </div>
      <h2 className="mt-8 font-display text-lg font-bold">Idee</h2>
      <p className="mt-2 leading-relaxed text-[#D9DEEA]">„Einwandfrei“ heißt makellos und steckt voller Einwände. Genau das ist das Ziel: jeden Einwand so souverän behandeln, dass das Gespräch einwandfrei läuft. Das Logo ist eine Sprechblase mit Haken: ein Gespräch, das zum Ja führt.</p>
      <h2 className="mt-8 font-display text-lg font-bold">Farben</h2>
      <div className="mt-3 space-y-2">
        {colors.map((c) => (
          <div key={c.hex} className="flex items-center gap-4 rounded-2xl bg-night-2 p-3">
            <span className="h-12 w-12 shrink-0 rounded-xl border border-white/10" style={{ background: c.hex }} />
            <span><span className="block font-semibold">{c.name} <span className="font-mono text-xs text-muted">{c.hex}</span></span><span className="text-sm text-muted">{c.use}</span></span>
          </div>
        ))}
      </div>
      <h2 className="mt-8 font-display text-lg font-bold">Schriften</h2>
      <div className="mt-3 space-y-2">
        <div className="rounded-2xl bg-night-2 p-4"><div className="font-display text-2xl font-bold">Space Grotesk</div><div className="text-sm text-muted">Überschriften: modern, selbstbewusst</div></div>
        <div className="rounded-2xl bg-night-2 p-4"><div className="text-2xl">Inter</div><div className="text-sm text-muted">Fließtext: sehr gut lesbar am Handy</div></div>
      </div>
    </div>
  );
}
