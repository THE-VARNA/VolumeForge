"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import {
  Trophy, Coins, Ticket, Send, Zap, Shield, BarChart3,
  ArrowRight, CheckCircle2, ChevronRight, Flame,
} from "lucide-react";

const STATS = [
  { label: "total volume incentivized", value: "$2.4B+" },
  { label: "active campaigns", value: "847" },
  { label: "traders rewarded", value: "124K+" },
  { label: "protocols using Torque", value: "38" },
];

const FEATURES = [
  {
    icon: Trophy,
    title: "Live Leaderboards",
    description:
      "Rank traders by real on-chain volume. Use Torque's recurring evaluation engine to update rankings automatically every epoch.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Coins,
    title: "Trade Rebates",
    description:
      "Return a percentage of each trader's volume as rebates. Formula: VALUE × (rebatePercentage / 100) — configured via Torque.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Ticket,
    title: "Weighted Raffles",
    description:
      "Higher-volume traders earn more raffle tickets. Configure WEIGHTED_BY_METRIC or EQUAL_CHANCES modes with bucket-defined prizes.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Send,
    title: "Direct Distribution",
    description:
      "Recurring fixed payouts to specific wallet addresses. Created as recurring incentives and tracked in Torque's system.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Anchor IDL Tracking",
    description:
      "Upload your protocol's Anchor IDL. VolumeForge parses instructions and builds a live data source for incentive queries.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Shield,
    title: "Anti-Sybil Engine",
    description:
      "Micro-trade filters, repetitive pattern detection, and frequency scoring assign each wallet a sybil risk score 0–100.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
];

const TORQUE_STEPS = [
  "Upload Anchor IDL → parse_idl → create_idl",
  "generate_incentive_query (source: idl_instruction)",
  "Create recurring incentive with Torque MCP",
  "Rewards distributed on schedule, on-chain",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base gradient-text">VolumeForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
            Dashboard
          </Link>
          <Link
            href="/connect"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-forge-hero" />
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-violet-300 mb-8 border border-violet-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Powered by Torque Protocol — Colosseum Hackathon 2026
            </div>

            <motion.h1 
              className="text-5xl md:text-7xl md:leading-[1.1] font-extrabold tracking-tight mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-slate-200 drop-shadow-sm">Turn Trading Volume</span>
              <br />
              <span className="gradient-text drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Into Compounding Loyalty</span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Launch live leaderboards, automated rebates, and weighted raffles directly from your Anchor IDL. 
              Stop one-time airdrop dumpers with built-in Anti-Sybil intelligence — powered natively by the Torque MCP.
            </motion.p>

            <motion.div 
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-violet-600/90 hover:bg-violet-500 text-white font-semibold text-sm transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] backdrop-blur-md"
              >
                Open Dashboard
              </Link>
              <Link
                href="/campaigns/new"
                className="px-6 py-3 rounded-xl glass hover:bg-white/10 text-slate-200 font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg border border-white/10"
              >
                Build Campaign
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Live stats */}
      <section className="py-12 px-6 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-5 text-center"
            >
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-100 mb-3">
              Every incentive primitive, in one engine
            </h2>
            <p className="text-slate-400">
              Backed by Torque&apos;s four documented incentive types — leaderboard, rebate, raffle, and direct.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <GlassCard variant="hover" className="h-full">
                    <div
                      className={`inline-flex p-2.5 rounded-lg border mb-4 ${feature.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-slate-100 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Torque integration callout */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <GlassCard variant="violet" className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 mb-6">
              <BarChart3 className="w-3.5 h-3.5" />
              Torque MCP Integration
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">
              Built on official Torque APIs — no vaporware
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              Every incentive creates a real Torque recurring offer. IDL tracking follows the
              documented pipeline. Custom events use the official ingestion endpoint with
              the correct payload shape.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
              {TORQUE_STEPS.map((step) => (
                <div key={step} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-mono">{step}</span>
                </div>
              ))}
            </div>
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              Create First Campaign <ChevronRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06] text-center">
        <p className="text-xs text-muted-foreground">
          VolumeForge · Colosseum Hackathon 2026 · Powered by{" "}
          <a href="https://torque.so" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
            Torque Protocol
          </a>
        </p>
      </footer>
    </div>
  );
}
