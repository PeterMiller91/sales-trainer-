"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Start", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/akademie", label: "Akademie", icon: "M2 8l10-5 10 5-10 5zM6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" },
  { href: "/bibliothek", label: "Bibliothek", icon: "M4 4h5v16H4zM10 4h4v16h-4zM15.5 5l4 15" },
  { href: "/training", label: "Training", icon: "M4 5h16v11H9l-5 4z" },
  { href: "/profil", label: "Profil", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-night/90 backdrop-blur-lg pb-safe">
      <ul className="mx-auto flex max-w-xl justify-around pt-2">
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href) || (it.href === "/bibliothek" && (path.startsWith("/vorwand") || path.startsWith("/karteikarten")));
          return (
            <li key={it.href} className="flex-1">
              <Link href={it.href} className={`flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium ${active ? "text-signal" : "text-muted"}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={it.icon} /></svg>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
