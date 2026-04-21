// Anti-sybil scoring logic
// Produces a SybilRiskScore 0–100 per wallet

export interface SybilSignal {
  type: string;
  score: number;
  details: Record<string, unknown>;
}

export interface SybilRiskResult {
  wallet: string;
  score: number; // 0 = clean, 100 = high risk
  signals: SybilSignal[];
  label: "CLEAN" | "SUSPICIOUS" | "HIGH_RISK";
}

// Minimum trade size — below this is a wash-trade flag
const MIN_TRADE_USD = 50;

// If a wallet makes trades with values within this % of each other repeatedly → flag
const REPETITIVE_VARIANCE_THRESHOLD = 0.05;
const REPETITIVE_COUNT_THRESHOLD = 5;

interface TradeData {
  wallet: string;
  amountUsd: number;
  timestamp: Date;
  programId: string;
}

export function scoreSybilRisk(
  wallet: string,
  trades: TradeData[],
): SybilRiskResult {
  const signals: SybilSignal[] = [];
  let totalScore = 0;

  // Signal 1 — micro-trade filter (wash trades < $50 USD)
  const microTrades = trades.filter((t) => t.amountUsd < MIN_TRADE_USD);
  if (microTrades.length > 0) {
    const microScore = Math.min(30, microTrades.length * 5);
    totalScore += microScore;
    signals.push({
      type: "MICRO_TRADES",
      score: microScore,
      details: {
        count: microTrades.length,
        threshold: MIN_TRADE_USD,
        message: `${microTrades.length} trades below $${MIN_TRADE_USD} USD`,
      },
    });
  }

  // Signal 2 — repetitive pattern (near-identical amounts at regular intervals)
  if (trades.length >= REPETITIVE_COUNT_THRESHOLD) {
    const amounts = trades.map((t) => t.amountUsd).sort((a, b) => a - b);
    const mean = amounts.reduce((s, v) => s + v, 0) / amounts.length;
    const variance =
      amounts.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / amounts.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

    if (cv < REPETITIVE_VARIANCE_THRESHOLD && trades.length >= REPETITIVE_COUNT_THRESHOLD) {
      const repScore = Math.min(40, trades.length * 3);
      totalScore += repScore;
      signals.push({
        type: "REPETITIVE_PATTERN",
        score: repScore,
        details: {
          tradeCount: trades.length,
          coefficientOfVariation: cv.toFixed(4),
          message: `Low variance trade pattern detected (CV=${cv.toFixed(4)})`,
        },
      });
    }
  }

  // Signal 3 — very high trade frequency (bot-like)
  if (trades.length > 1) {
    const timestamps = trades
      .map((t) => t.timestamp.getTime())
      .sort((a, b) => a - b);
    const gaps: number[] = [];
    for (let i = 1; i < timestamps.length; i++) {
      gaps.push(timestamps[i] - timestamps[i - 1]);
    }
    const avgGapMs = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    const avgGapSec = avgGapMs / 1000;

    if (avgGapSec < 30 && trades.length > 10) {
      const freqScore = Math.min(30, Math.floor(30 / avgGapSec) * 5);
      totalScore += freqScore;
      signals.push({
        type: "HIGH_FREQUENCY",
        score: freqScore,
        details: {
          avgGapSeconds: avgGapSec.toFixed(1),
          tradeCount: trades.length,
          message: `Average ${avgGapSec.toFixed(1)}s between trades`,
        },
      });
    }
  }

  const capped = Math.min(100, totalScore);
  const label =
    capped >= 70 ? "HIGH_RISK" : capped >= 35 ? "SUSPICIOUS" : "CLEAN";

  return { wallet, score: capped, signals, label };
}

export function getSybilRiskColor(score: number): string {
  if (score >= 70) return "text-red-400";
  if (score >= 35) return "text-amber-400";
  return "text-emerald-400";
}

export function getSybilRiskBg(score: number): string {
  if (score >= 70) return "bg-red-500/10 border-red-500/20";
  if (score >= 35) return "bg-amber-500/10 border-amber-500/20";
  return "bg-emerald-500/10 border-emerald-500/20";
}
