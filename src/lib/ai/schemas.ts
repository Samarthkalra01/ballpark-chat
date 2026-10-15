import { z } from "zod";
import { MAX_ANSWER_CHARS } from "@/lib/constants";

// ---- API request schemas -------------------------------------------------

export const generateRequestSchema = z.object({
  category: z.enum(["revenue_profit", "mathematical", "market_sizing", "unconventional"]),
  difficulty: z.enum(["easy", "medium", "challenging"]),
  geography: z.enum(["India", "Global"]).default("India"),
});
export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const evaluateRequestSchema = z.object({
  answerHtml: z.string().max(MAX_ANSWER_CHARS),
  answerText: z.string().max(MAX_ANSWER_CHARS),
  timeSpentSeconds: z.number().int().min(0).max(60 * 60 * 24),
});
export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>;

export const feedbackRequestSchema = z.object({
  helpful: z.boolean(),
});

// ---- AI output schemas (validated after every Gemini call) ---------------

export const generationSchema = z.object({
  question: z.string().min(5),
  clarifications: z.array(z.string()).max(3).default([]),
  expected_answer_range: z.string().default(""),
  key_drivers: z.array(z.string()).min(1).max(8).default([]),
});
export type GenerationResult = z.infer<typeof generationSchema>;

export const rubricSchema = z.object({
  structure: z.number().int().min(0).max(10),
  assumptions: z.number().int().min(0).max(10),
  calculation: z.number().int().min(0).max(10),
  sanity_check: z.number().int().min(0).max(10),
  communication: z.number().int().min(0).max(10),
});
export type Rubric = z.infer<typeof rubricSchema>;

export const evaluationSchema = z.object({
  overall_score: z.number().int().min(0).max(10),
  verdict: z.string().min(1),
  rubric: rubricSchema,
  strengths: z.array(z.string()).min(1).max(4),
  improvements: z.array(z.string()).min(1).max(4),
  model_approach: z.array(z.string()).min(1).max(8),
  model_answer_range: z.string().default(""),
});
export type EvaluationResult = z.infer<typeof evaluationSchema>;

/**
 * Server-side recompute of the overall score from the rubric (PRD 8.3).
 * Never trust the model's own arithmetic.
 */
export function computeOverall(rubric: Rubric): number {
  const raw =
    0.3 * rubric.structure +
    0.25 * rubric.assumptions +
    0.2 * rubric.calculation +
    0.1 * rubric.sanity_check +
    0.15 * rubric.communication;
  return Math.min(10, Math.max(0, Math.round(raw)));
}
