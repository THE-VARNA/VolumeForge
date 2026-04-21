// Formula validator — enforces the documented variable set from Torque formulas page
// Allowed variables: N, VALUE, RANK, INDEX, TOTAL_PARTICIPANTS, TOTAL_REWARD_POOL
// Allowed functions: sqrt, pow, abs, floor, ceil, round, min, max, log, exp

const ALLOWED_VARS = new Set([
  "N",
  "VALUE",
  "RANK",
  "INDEX",
  "TOTAL_PARTICIPANTS",
  "TOTAL_REWARD_POOL",
]);

const ALLOWED_FUNCTIONS = new Set([
  "sqrt",
  "pow",
  "abs",
  "floor",
  "ceil",
  "round",
  "min",
  "max",
  "log",
  "exp",
]);

// Example valid formulas from the official docs:
// N
// TOTAL_REWARD_POOL / TOTAL_PARTICIPANTS
// sqrt(N)
// RANK <= 3 ? (4 - RANK) * 100 : 0
// min(N, 50)
// log(N + 1)
// RANK <= ceil(TOTAL_PARTICIPANTS * 0.1) ? N * 2 : N
export const FORMULA_EXAMPLES: Record<string, string> = {
  "Default (raw metric)": "N",
  "Equal split": "TOTAL_REWARD_POOL / TOTAL_PARTICIPANTS",
  "Square root damping": "sqrt(N)",
  "Top 3 fixed prizes": "RANK <= 3 ? (4 - RANK) * 100 : 0",
  "Capped at 50": "min(N, 50)",
  "Logarithmic": "log(N + 1)",
  "Top 10% double reward": "RANK <= ceil(TOTAL_PARTICIPANTS * 0.1) ? N * 2 : N",
  "Diminishing by rank": "TOTAL_REWARD_POOL / pow(RANK, 0.5)",
};

export interface FormulaValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFormula(formula: string): FormulaValidationResult {
  const errors: string[] = [];

  if (!formula.trim()) {
    return { valid: false, errors: ["Formula cannot be empty"] };
  }

  // Extract all identifiers (sequences of letters, digits, underscores starting with letter/underscore)
  const identifierPattern = /\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
  const matches = Array.from(formula.matchAll(identifierPattern));

  for (const match of matches) {
    const id = match[1];
    if (!ALLOWED_VARS.has(id) && !ALLOWED_FUNCTIONS.has(id)) {
      const vars = Array.from(ALLOWED_VARS).join(", ");
      const fns = Array.from(ALLOWED_FUNCTIONS).join(", ");
      errors.push(
        `Unknown identifier "${id}". Allowed variables: ${vars}. Allowed functions: ${fns}.`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// Build the rebate formula — constructed from rebatePercentage per docs
// "VALUE * (rebatePercentage / 100)"
export function buildRebateFormula(rebatePercentage: number): string {
  return `VALUE * ${(rebatePercentage / 100).toFixed(4)}`;
}

// Build a rank-prize formula from a tier map
export function buildRankPrizeFormula(
  prizes: { rank: number; amount: number }[],
): string {
  const sorted = [...prizes].sort((a, b) => a.rank - b.rank);
  if (sorted.length === 0) return "0";

  return sorted.reduceRight((acc, { rank, amount }) => {
    return `RANK == ${rank} ? ${amount} : ${acc}`;
  }, "0");
}
