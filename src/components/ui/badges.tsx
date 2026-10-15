import { cn } from "@/lib/utils";
import { DIFFICULTY_LABEL, type DifficultyKey } from "@/lib/constants";

export function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
      {label}
    </span>
  );
}

export function DifficultyPill({ difficulty }: { difficulty: DifficultyKey }) {
  return (
    <span
      className={cn(
        "rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        difficulty === "easy" && "bg-emerald-100 text-emerald-800",
        difficulty === "medium" && "bg-amber-100 text-amber-800",
        difficulty === "challenging" && "bg-rose-100 text-rose-800",
      )}
    >
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  );
}
