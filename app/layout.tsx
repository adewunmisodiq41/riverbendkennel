import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/actions/settings";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap"
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-worksans",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`
    },
    description:
      "A family kennel breeding for health, temperament, and pedigree — dogs and puppies for sale, available studs, and upcoming litters.",
    icons: settings.logoUrl ? { icon: settings.logoUrl } : undefined
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
