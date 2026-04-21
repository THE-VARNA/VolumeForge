"use client";

import { useState } from "react";
// imports cleaned
import { GlassCard } from "@/components/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Coins, Ticket, Send, ChevronRight, ChevronLeft,
  Zap, Upload, Check, AlertCircle, Plus, Minus,
} from "lucide-react";
import { FORMULA_EXAMPLES, validateFormula } from "@/lib/domain/formulas";
import { cn } from "@/lib/utils";

const INCENTIVE_TYPES = [
  {
    id: "LEADERBOARD",
    icon: Trophy,
    label: "Leaderboard",
    description: "Rank traders by metric value. Top performers earn from the reward pool.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    active: "ring-2 ring-violet-500",
  },
  {
    id: "REBATE",
    icon: Coins,
    label: "Rebate",
    description: "Return a % of each trader's activity value. Formula: VALUE × (rebate% / 100).",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    active: "ring-2 ring-cyan-500",
  },
  {
    id: "RAFFLE",
    icon: Ticket,
    label: "Raffle",
    description: "Random draw with weighted tickets. Higher volume = more chances to win.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    active: "ring-2 ring-amber-500",
  },
  {
    id: "DIRECT",
    icon: Send,
    label: "Direct (Recurring)",
    description: "Recurring fixed payouts to specific wallet addresses via Torque.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    active: "ring-2 ring-emerald-500",
  },
];

const EVENT_SOURCES = [
  {
    id: "idl",
    label: "Anchor IDL",
    icon: Upload,
    description: "Parse program instruction data from an uploaded Anchor IDL.",
    steps: ["parse_idl", "create_idl", "generate_incentive_query (idl_instruction)", "create_recurring_incentive"],
  },
  {
    id: "custom",
    label: "Custom Event",
    icon: Zap,
    description: "Track off-chain activity via Torque custom event ingestion.",
    steps: ["create_custom_event", "attach_custom_event", "ingest event once", "generate_incentive_query"],
  },
];

const STEPS = [
  "Choose Type",
  "Event Source",
  "Configure Metrics",
  "Reward & Schedule",
  "Preview",
  "Confirm",
];

export default function CampaignBuilderPage() {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [formula, setFormula] = useState("N");
  const [formulaError, setFormulaError] = useState<string | null>(null);
  const [rewardPool, setRewardPool] = useState(50);
  const [rebatePercent, setRebatePercent] = useState(5);
  const [raffleBuckets, setRaffleBuckets] = useState([
    { amount: 10, count: 1 },
    { amount: 5, count: 5 },
  ]);
  const [scheduleMode, setScheduleMode] = useState<"interval" | "duration">("interval");
  const [interval, setIntervalVal] = useState("WEEKLY");
  const [duration, setDuration] = useState(7);
  const [campaignName, setCampaignName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalRaffleFund = raffleBuckets.reduce((s, b) => s + b.amount * b.count, 0);

  const handleFormulaChange = (v: string) => {
    setFormula(v);
    const result = validateFormula(v);
    setFormulaError(result.valid ? null : result.errors[0]);
  };

  const addBucket = () => setRaffleBuckets((b) => [...b, { amount: 1, count: 1 }]);
  const removeBucket = (i: number) => setRaffleBuckets((b) => b.filter((_, idx) => idx !== i));
  const updateBucket = (i: number, field: "amount" | "count", val: number) =>
    setRaffleBuckets((b) => b.map((bucket, idx) => idx === i ? { ...bucket, [field]: val } : bucket));

  const handleSubmit = async () => {
    setSubmitted(true);
    // In production: POST /api/campaigns with full payload
    await new Promise((r) => setTimeout(r, 1500));
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100">Campaign Builder</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Create a Torque recurring incentive in 6 steps
        </p>
      </motion.div>

      {/* Step progress */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all",
                i < step ? "bg-violet-600 text-white" : i === step ? "bg-violet-500/20 border-2 border-violet-500 text-violet-400" : "bg-white/5 text-muted-foreground",
              )}
            >
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px flex-1 mx-1 transition-all", i < step ? "bg-violet-600" : "bg-white/10")} />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground -mt-2">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 0 — Type */}
          {step === 0 && (
            <GlassCard>
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Select incentive type</h2>
              <p className="text-xs text-muted-foreground mb-5">
                Torque supports exactly 4 types. Each determines how rewards are distributed.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {INCENTIVE_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all",
                        t.bg,
                        selectedType === t.id ? t.active : "hover:opacity-90",
                      )}
                    >
                      <div className={cn("flex items-center gap-2 mb-2", t.color)}>
                        <Icon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{t.label}</span>
                        {selectedType === t.id && <Check className="w-3.5 h-3.5 ml-auto" />}
                      </div>
                      <p className="text-xs text-slate-400">{t.description}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Campaign name..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </GlassCard>
          )}

          {/* Step 1 — Source */}
          {step === 1 && (
            <GlassCard>
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Select event source</h2>
              <div className="flex flex-col gap-3">
                {EVENT_SOURCES.map((src) => {
                  const Icon = src.icon;
                  return (
                    <button
                      key={src.id}
                      onClick={() => setSelectedSource(src.id)}
                      className={cn(
                        "text-left p-4 rounded-xl glass border transition-all",
                        selectedSource === src.id ? "ring-2 ring-violet-500 border-violet-500/30" : "border-white/10 hover:border-white/20",
                      )}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{src.label}</p>
                          <p className="text-xs text-muted-foreground">{src.description}</p>
                        </div>
                        {selectedSource === src.id && (
                          <Check className="w-4 h-4 text-violet-400 ml-auto" />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {src.steps.map((s, i) => (
                          <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {/* Step 2 — Metrics / Formula */}
          {step === 2 && (
            <GlassCard>
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Configure metrics & formula</h2>

              {selectedType === "LEADERBOARD" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Custom formula{" "}
                      <span className="text-slate-400">(leave blank for default: N)</span>
                    </label>
                    <input
                      value={formula}
                      onChange={(e) => handleFormulaChange(e.target.value)}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-lg bg-white/5 border text-sm font-mono text-slate-200 outline-none transition-colors",
                        formulaError ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50",
                      )}
                    />
                    {formulaError && (
                      <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                        <AlertCircle className="w-3 h-3" />
                        {formulaError}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Allowed variables: N · VALUE · RANK · INDEX · TOTAL_PARTICIPANTS · TOTAL_REWARD_POOL
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Formula examples</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(FORMULA_EXAMPLES).map(([label, f]) => (
                        <button
                          key={label}
                          onClick={() => handleFormulaChange(f)}
                          className="text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors"
                        >
                          <p className="text-[10px] text-muted-foreground">{label}</p>
                          <p className="text-xs font-mono text-slate-300 truncate">{f}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedType === "REBATE" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Rebate percentage
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0.1}
                      max={20}
                      step={0.1}
                      value={rebatePercent}
                      onChange={(e) => setRebatePercent(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xl font-bold mono text-cyan-400 w-16 text-right">
                      {rebatePercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formula: <span className="font-mono text-slate-300">VALUE × {(rebatePercent / 100).toFixed(4)}</span>
                    {" "}(auto-constructed by Torque MCP)
                  </p>
                </div>
              )}

              {selectedType === "RAFFLE" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Prize buckets</label>
                    <button onClick={addBucket} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300">
                      <Plus className="w-3 h-3" /> Add bucket
                    </button>
                  </div>
                  {raffleBuckets.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 glass rounded-lg p-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-muted-foreground">Amount (SOL)</label>
                          <input
                            type="number"
                            value={b.amount}
                            onChange={(e) => updateBucket(i, "amount", Number(e.target.value))}
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-sm mono text-slate-200 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground">Winners</label>
                          <input
                            type="number"
                            value={b.count}
                            onChange={(e) => updateBucket(i, "count", Number(e.target.value))}
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-sm mono text-slate-200 outline-none"
                          />
                        </div>
                      </div>
                      <button onClick={() => removeBucket(i)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-muted-foreground">Total fund (auto-calculated)</span>
                    <span className="font-semibold mono text-amber-400">{totalRaffleFund} SOL</span>
                  </div>
                </div>
              )}

              {selectedType === "DIRECT" && (
                <div>
                  <p className="text-sm text-slate-400">
                    Direct distribution creates a recurring incentive with specific wallet allocations.
                    Allocations are wired as an inline SQL query by Torque internally.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 glass rounded-lg p-3 font-mono">
                    {`[{ "address": "wallet...", "amount": 100 }, ...]`}
                  </p>
                </div>
              )}
            </GlassCard>
          )}

          {/* Step 3 — Reward & Schedule */}
          {step === 3 && (
            <GlassCard>
              <h2 className="text-sm font-semibold text-slate-200 mb-5">Reward pool & schedule</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Reward pool (SOL)</label>
                  <input
                    type="number"
                    value={rewardPool}
                    onChange={(e) => setRewardPool(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm mono text-slate-200 outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                {/* Schedule XOR — doc rule enforced in UI */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Schedule <span className="text-violet-400">(choose one — not both)</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setScheduleMode("interval")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        scheduleMode === "interval"
                          ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                          : "glass text-slate-400 hover:text-slate-200",
                      )}
                    >
                      Recurring interval
                    </button>
                    <button
                      onClick={() => setScheduleMode("duration")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        scheduleMode === "duration"
                          ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                          : "glass text-slate-400 hover:text-slate-200",
                      )}
                    >
                      Fixed duration
                    </button>
                  </div>

                  {scheduleMode === "interval" && (
                    <select
                      value={interval}
                      onChange={(e) => setIntervalVal(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 outline-none"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  )}

                  {scheduleMode === "duration" && (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm mono text-slate-200 outline-none"
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Step 4 — Preview */}
          {step === 4 && (
            <GlassCard>
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Query preview</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Torque&apos;s optional <span className="font-mono text-slate-300">preview_incentive_query</span> shows
                sample wallet rankings before committing the incentive.
              </p>
              <div className="glass rounded-lg p-4 font-mono text-xs text-slate-300 space-y-1">
                <p className="text-muted-foreground">{`-- Sample query (IDL instruction source)`}</p>
                <p>{`SELECT wallet_address, SUM(amount_usd) AS value`}</p>
                <p>{`FROM program_instructions`}</p>
                <p>{`WHERE instruction_name = 'swap'`}</p>
                <p>{`  AND timestamp >= NOW() - INTERVAL '7 days'`}</p>
                <p>{`GROUP BY wallet_address`}</p>
                <p>{`ORDER BY value DESC`}</p>
                <p>{`LIMIT 100;`}</p>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { wallet: "7xKXtg2...", value: "842,000" },
                  { wallet: "3fAzTkm...", value: "215,000" },
                  { wallet: "9pTBJv3...", value: "184,000" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between text-xs glass rounded-lg px-3 py-2">
                    <span className="font-mono text-slate-300">{r.wallet}</span>
                    <span className="font-mono text-violet-400">${r.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Step 5 — Confirm */}
          {step === 5 && (
            <GlassCard variant="violet">
              {!submitted ? (
                <>
                  <h2 className="text-sm font-semibold text-slate-200 mb-5">Confirm & deploy</h2>
                  <div className="space-y-3 mb-6 text-sm">
                    {[
                      ["Campaign", campaignName || "Untitled"],
                      ["Type", selectedType ?? "—"],
                      ["Source", selectedSource ?? "—"],
                      ["Reward Pool", `${rewardPool} SOL`],
                      ["Schedule", scheduleMode === "interval" ? interval : `${duration} days`],
                      ["Formula", selectedType === "REBATE" ? `VALUE × ${(rebatePercent / 100).toFixed(4)}` : formula],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium text-slate-200 mono">{v}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Deploy Campaign to Torque
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">Campaign Deployed!</h3>
                  <p className="text-sm text-muted-foreground">
                    Torque recurring incentive created. Evaluation begins at the next epoch boundary.
                  </p>
                </div>
              )}
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!submitted && (
        <div className="flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass text-sm text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-40"
          >
            {step === STEPS.length - 2 ? "Review" : "Continue"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
