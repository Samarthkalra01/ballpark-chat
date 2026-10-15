import type { CategoryKey, DifficultyKey } from "@/lib/constants";
import type { Rubric, EvaluationResult } from "@/lib/ai/schemas";

export type AttemptStatus = "in_progress" | "evaluated" | "abandoned";
export type AttemptSource = "ai" | "bank";

/** One row of the `attempts` table. */
export interface AttemptRow {
  id: string;
  user_id: string;
  category: CategoryKey;
  difficulty: DifficultyKey;
  geography: string;
  question: string;
  clarifications: string[];
  expected_answer_range: string | null;
  key_drivers: string[];
  source: AttemptSource;
  answer_html: string | null;
  answer_text: string | null;
  time_spent_seconds: number | null;
  status: AttemptStatus;
  score: number | null;
  rubric: Rubric | null;
  feedback: EvaluationResult | null;
  helpful: boolean | null;
  created_at: string;
  submitted_at: string | null;
  evaluated_at: string | null;
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  created_at: string;
}
