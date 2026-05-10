"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Bell, Plus } from "lucide-react";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function Topbar() {
  return (
    <header className="h-14 px-6 flex items-center gap-4 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex-1" />

      <Link
        href="/campaigns/new"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        New Campaign
      </Link>

      <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
        <Bell className="w-4.5 h-4.5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
      </button>

      <WalletMultiButtonDynamic
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.5rem",
          fontSize: "0.8rem",
          height: "36px",
          padding: "0 12px",
        }}
      />
    </header>
  );
}
