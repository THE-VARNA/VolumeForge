"use client";

import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { CheckCircle2, Circle, Flame, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const SETUP_STEPS = [
  { label: "Connect wallet", key: "wallet" },
  { label: "Select active Torque project", key: "project" },
  { label: "Verify Torque API key", key: "apikey" },
  { label: "Configure event source (IDL or custom event)", key: "source" },
];

export default function ConnectPage() {
  const { connected, publicKey } = useWallet();

  const completedSteps = {
    wallet: connected,
    project: false,
    apikey: false,
    source: false,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">VolumeForge</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect wallet to get started</p>
        </div>

        {/* Wallet connect */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Step 1 — Connect Wallet</h2>
          <div className="flex justify-center">
            <WalletMultiButton
              style={{
                background: "rgba(124,58,237,0.2)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                padding: "10px 20px",
                height: "auto",
              }}
            />
          </div>
          {connected && publicKey && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-xs text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              Connected: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-6)}
            </motion.div>
          )}
        </GlassCard>

        {/* Torque project */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Step 2 — Active Project</h2>
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-2.5 mb-3">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-muted-foreground">Torque project scope</span>
          </div>
          <input
            placeholder="TORQUE_PROJECT_ID..."
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm mono text-slate-200 placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors"
          />
          <p className="text-[10px] text-muted-foreground mt-2">
            All IDL tracking and custom events are scoped to the active project. Set TORQUE_PROJECT_ID in .env.local.
          </p>
        </GlassCard>

        {/* Setup checklist */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Onboarding Checklist</h2>
          <div className="flex flex-col gap-3">
            {SETUP_STEPS.map((step) => {
              const done = completedSteps[step.key as keyof typeof completedSteps];
              return (
                <div key={step.key} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${done ? "text-slate-300" : "text-slate-500"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {connected && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
