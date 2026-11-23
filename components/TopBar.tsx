import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-night/85 backdrop-blur-lg" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-xl items-center gap-2 px-4">
        <Link href="/" className="flex items-center gap-2"><LogoMark size={28} /><Wordmark className="text-lg" /></Link>
      </div>
    </header>
  );
}
