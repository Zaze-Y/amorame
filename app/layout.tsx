import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amora — Bientôt, le désir",
  description: "Amora. Une nouvelle histoire d’amour commence dans deux mois.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
