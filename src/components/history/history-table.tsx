"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { CategoryBadge, DifficultyPill } from "@/components/ui/badges";
import {
  CATEGORY_LABEL,
  CATEGORIES,
  DIFFICULTY_KEYS,
  DIFFICULTY_LABEL,
  type CategoryKey,
  type DifficultyKey,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  created_at: string;
  question: string;
  category: CategoryKey;
  difficulty: DifficultyKey;
  score: number;
}

const PAGE_SIZE = 10;

export function HistoryTable({ items }: { items: HistoryItem[] }) {
  const router = useRouter();
  const [category, setCategory] = useState<"all" | CategoryKey>("all");
  const [difficulty, setDifficulty] = useState<"all" | DifficultyKey>("all");
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const list = items.filter(
      (i) =>
        (category === "all" || i.category === category) &&
        (difficulty === "all" || i.difficulty === difficulty),
    );
    list.sort((a, b) => {
      const cmp =
        sortBy === "rating"
          ? a.score - b.score
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [items, category, difficulty, sortBy, dir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: "date" | "rating") {
    if (sortBy === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setDir("desc");
    }
    setPage(0);
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Filters */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={category === "all"} onClick={() => { setCategory("all"); setPage(0); }}>
            All
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.key}
              active={category === c.key}
              onClick={() => { setCategory(c.key); setPage(0); }}
            >
              {c.label}
            </FilterChip>
          ))}
        </div>
        <select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value as "all" | DifficultyKey); setPage(0); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-600 focus:outline-none"
        >
          <option value="all">All difficulties</option>
          {DIFFICULTY_KEYS.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABEL[d]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-3.5">
                <button onClick={() => toggleSort("date")} className="flex items-center gap-1">
                  Date <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-3.5">Question</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Difficulty</th>
              <th className="p-3.5">
                <button onClick={() => toggleSort("rating")} className="flex items-center gap-1">
                  AI Rating <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => router.push(`/solve/${r.id}/result`)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >
                <td className="whitespace-nowrap p-3.5 font-mono text-slate-500">
                  {formatDate(r.created_at)}
                </td>
                <td className="max-w-xs truncate p-3.5 font-bold text-slate-800" title={r.question}>
                  {r.question}
                </td>
                <td className="p-3.5">
                  <CategoryBadge label={CATEGORY_LABEL[r.category]} />
                </td>
                <td className="p-3.5">
                  <DifficultyPill difficulty={r.difficulty} />
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${(r.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800">{r.score} / 10</span>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No attempts match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Page {current + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={current >= pageCount - 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors",
        active ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      )}
    >
      {children}
    </button>
  );
}
