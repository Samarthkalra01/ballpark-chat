import { scoreBand } from "@/lib/constants";
import { cn } from "@/lib/utils";

const BAND_STROKE: Record<string, string> = {
  danger: "text-rose-500",
  amber: "text-amber-500",
  royal: "text-indigo-600",
  success: "text-emerald-600",
};

/** Circular 0–10 score ring (SVG), coloured by band. PRD FR-4.1. */
export function ScoreRing({
  score,
  size = 112,
}: {
  score: number;
  size?: number;
}) {
  const r = 45;
  const circumference = 2 * Math.PI * r; // ≈ 283
  const pct = Math.max(0, Math.min(10, score)) / 10;
  const offset = circumference - circumference * pct;
  const band = scoreBand(score);

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score ${score} out of 10`}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={r}
          className="text-slate-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          className={cn("transition-all duration-1000 ease-out", BAND_STROKE[band])}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-800">{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          / 10
        </span>
      </div>
    </div>
  );
}
