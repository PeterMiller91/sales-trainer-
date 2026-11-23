import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Einwandfrei – Verkaufstrainer",
  description: "Einwand- und Vorwandbehandlung trainieren, nach den Prinzipien von Alex Hormozi.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Einwandfrei", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#0E1424", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <TopBar />
        <main className="mx-auto max-w-xl px-4 pt-5 pb-28">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
