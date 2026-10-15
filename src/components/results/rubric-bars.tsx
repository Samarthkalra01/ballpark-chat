import { RUBRIC_DIMENSIONS } from "@/lib/constants";
import type { Rubric } from "@/lib/ai/schemas";

export function RubricBars({ rubric }: { rubric: Rubric }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
        Rubric breakdown
      </h3>
      <div className="grid grid-cols-1 gap-5 text-xs md:grid-cols-2">
        {RUBRIC_DIMENSIONS.map((dim) => {
          const value = rubric[dim.key];
          return (
            <div key={dim.key}>
              <div className="mb-1.5 flex justify-between font-bold text-slate-700">
                <span>{dim.label}</span>
                <span className="text-indigo-600">{value} / 10</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
