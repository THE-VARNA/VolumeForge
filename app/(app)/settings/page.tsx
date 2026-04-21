"use client";

import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";
import { Settings, Shield, Clock, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [minTradeUsd, setMinTradeUsd] = useState(50);
  const [highRiskThreshold, setHighRiskThreshold] = useState(70);
  const [suspiciousThreshold, setSuspiciousThreshold] = useState(35);
  const [excludeHighRisk, setExcludeHighRisk] = useState(true);
  const [defaultInterval, setDefaultInterval] = useState("WEEKLY");

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" /> Settings & Rules
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure anti-sybil rules, campaign defaults, and admin controls
        </p>
      </motion.div>

      {/* Anti-sybil */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200">Anti-Sybil Rules</h2>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Minimum trade size threshold (USD)
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={500} value={minTradeUsd}
                onChange={(e) => setMinTradeUsd(Number(e.target.value))} className="flex-1" />
              <span className="text-sm font-bold mono text-cyan-400 w-14 text-right">${minTradeUsd}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Trades below this value are flagged as potential wash trades
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">High-risk score threshold (0–100)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={100} value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))} className="flex-1" />
              <span className="text-sm font-bold mono text-red-400 w-8">{highRiskThreshold}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Suspicious score threshold (0–100)</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={100} value={suspiciousThreshold}
                onChange={(e) => setSuspiciousThreshold(Number(e.target.value))} className="flex-1" />
              <span className="text-sm font-bold mono text-amber-400 w-8">{suspiciousThreshold}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Exclude HIGH_RISK from reward distribution</p>
              <p className="text-xs text-muted-foreground">Wallets above high-risk threshold are ineligible</p>
            </div>
            <button
              onClick={() => setExcludeHighRisk((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors ${excludeHighRisk ? "bg-cyan-600" : "bg-white/10"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${excludeHighRisk ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Campaign defaults */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-slate-200">Campaign Defaults</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Default epoch interval</label>
            <select value={defaultInterval} onChange={(e) => setDefaultInterval(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 outline-none">
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">
              Note: evalDurationDays and interval are mutually exclusive in Torque (doc-enforced)
            </p>
          </div>
        </div>
      </GlassCard>

      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
}
