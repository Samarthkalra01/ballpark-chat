// Shared, UI-agnostic constants for Ballpark.
// Category keys match the Postgres enum `question_category` (see supabase/migrations).

export const CATEGORY_KEYS = [
  "revenue_profit",
  "mathematical",
  "market_sizing",
  "unconventional",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const DIFFICULTY_KEYS = ["easy", "medium", "challenging"] as const;
export type DifficultyKey = (typeof DIFFICULTY_KEYS)[number];

export const GEOGRAPHIES = ["India", "Global"] as const;
export type Geography = (typeof GEOGRAPHIES)[number];

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  /** lucide-react icon name */
  icon: string;
  helper: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "revenue_profit",
    label: "Revenue / Profit Estimation",
    icon: "IndianRupee",
    helper: "Estimate a business's revenue or profit",
  },
  {
    key: "mathematical",
    label: "Mathematical",
    icon: "Calculator",
    helper: "Pure estimation with numbers and logic",
  },
  {
    key: "market_sizing",
    label: "Market Sizing",
    icon: "PieChart",
    helper: "Size a market or customer base",
  },
  {
    key: "unconventional",
    label: "Unconventional",
    icon: "Lightbulb",
    helper: "Quirky, creative estimation questions",
  },
];

export const CATEGORY_LABEL: Record<CategoryKey, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<CategoryKey, string>;

export const DIFFICULTY_LABEL: Record<DifficultyKey, string> = {
  easy: "Easy",
  medium: "Medium",
  challenging: "Challenging",
};

export function isCategoryKey(v: unknown): v is CategoryKey {
  return typeof v === "string" && (CATEGORY_KEYS as readonly string[]).includes(v);
}

export function isDifficultyKey(v: unknown): v is DifficultyKey {
  return typeof v === "string" && (DIFFICULTY_KEYS as readonly string[]).includes(v);
}

// The 5 evaluation rubric dimensions (PRD Section 8.3), each scored 0–10.
export const RUBRIC_DIMENSIONS = [
  { key: "structure", label: "Structure (MECE)" },
  { key: "assumptions", label: "Assumptions" },
  { key: "calculation", label: "Calculation accuracy" },
  { key: "sanity_check", label: "Sanity check" },
  { key: "communication", label: "Communication" },
] as const;

export type RubricKey = (typeof RUBRIC_DIMENSIONS)[number]["key"];

// Daily limits (env-overridable, read server-side).
export const DEFAULT_GENERATION_LIMIT = 30;
export const DEFAULT_EVALUATION_LIMIT = 20;

// Answer constraints.
export const MIN_ANSWER_WORDS = 40;
export const MAX_ANSWER_CHARS = 20000;

/** Colour band for a 0–10 score (used by the score ring). */
export function scoreBand(score: number): "danger" | "amber" | "royal" | "success" {
  if (score <= 4) return "danger";
  if (score <= 6) return "amber";
  if (score <= 8) return "royal";
  return "success";
}
