import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "VolumeForge — Retention Engine for Solana DEXs",
  description:
    "Convert real trading behavior into live leaderboards, rebates, and raffles. Anti-sybil volume incentives powered by Torque.",
  keywords: ["Solana", "DEX", "trading", "incentives", "leaderboard", "Torque", "DeFi"],
  openGraph: {
    title: "VolumeForge",
    description: "Retention engine for Solana DEXs and trading terminals",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
