import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  generationSchema,
  evaluationSchema,
  type GenerationResult,
  type EvaluationResult,
} from "@/lib/ai/schemas";
import { generationPrompt, evaluationPrompt } from "@/lib/ai/prompts";
import type { CategoryKey, DifficultyKey } from "@/lib/constants";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const TIMEOUT_MS = 30_000;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function callOnce(prompt: string, temperature: number): Promise<string> {
  const ai = getClient();
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature,
      httpOptions: { timeout: TIMEOUT_MS },
    },
  });
  return res.text ?? "";
}

/** Call Gemini, parse + validate JSON, retry once on invalid output. */
async function callValidated<T>(
  prompt: string,
  schema: z.ZodType<T>,
  temperature: number,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callOnce(prompt, temperature);
      const parsed = JSON.parse(stripFences(raw));
      return schema.parse(parsed);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("Gemini call failed");
}

export async function generateQuestion(opts: {
  category: CategoryKey;
  difficulty: DifficultyKey;
  geography: string;
  recentQuestions: string[];
}): Promise<GenerationResult> {
  const prompt = generationPrompt(opts);
  return callValidated(prompt, generationSchema, 1.0);
}

export async function evaluateAnswer(opts: {
  question: string;
  category: CategoryKey;
  difficulty: DifficultyKey;
  expectedAnswerRange: string;
  keyDrivers: string[];
  answerText: string;
}): Promise<EvaluationResult> {
  const prompt = evaluationPrompt(opts);
  return callValidated(prompt, evaluationSchema, 0.4);
}
