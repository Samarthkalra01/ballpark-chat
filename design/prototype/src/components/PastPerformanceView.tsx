import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  Filter,
  X,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CaseAttempt } from '../types';

interface PastPerformanceViewProps {
  attempts: CaseAttempt[];
  onSelectAttempt: (attempt: CaseAttempt) => void;
  onPracticeNewCase: () => void;
}

export const PastPerformanceView: React.FC<PastPerformanceViewProps> = ({
  attempts,
  onSelectAttempt,
  onPracticeNewCase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailAttempt, setActiveDetailAttempt] =
    useState<CaseAttempt | null>(null);

  // Filter attempts
  const filteredAttempts = attempts.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      item.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const latestAttempt = attempts[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
            Past Performance & Ratings
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Track your score progression across MBB case types and review partner feedback.
          </p>
        </div>

        <button
          onClick={onPracticeNewCase}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <span>Start New Case</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Latest Attempt Spotlight Card */}
      {latestAttempt && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-6">
              {/* Score Circular Gauge */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-slate-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-indigo-600"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * (latestAttempt.evaluation.overallScore * 10)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800">
                    {latestAttempt.evaluation.overallScore}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500">
                    / 10
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Latest Case • {latestAttempt.date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
                    {latestAttempt.categoryLabel}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800">
                  {latestAttempt.questionTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Rating: <strong className="text-indigo-600 font-bold">{latestAttempt.evaluation.ratingLabel}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveDetailAttempt(latestAttempt)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Review Detailed Feedback</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Green / Red Feedback Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>What you did well</span>
              </div>
              <ul className="space-y-1 text-xs text-emerald-800 font-medium">
                {latestAttempt.evaluation.whatYouDidWell.slice(0, 2).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <span>Areas for improvement</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-900 font-medium">
                {latestAttempt.evaluation.areasForImprovement.slice(0, 2).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filterable Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search case title or framework..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Market Sizing', 'Profitability', 'M&A', 'Pricing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Question Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Difficulty</th>
                <th className="p-3.5">AI Rating</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  onClick={() => setActiveDetailAttempt(attempt)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 text-slate-500 font-mono text-xs whitespace-nowrap">
                    {attempt.date}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 max-w-xs truncate">
                    {attempt.questionTitle}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
                      {attempt.categoryLabel}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider capitalize ${
                        attempt.difficulty === 'easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : attempt.difficulty === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {attempt.difficulty}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{
                            width: `${(attempt.evaluation.overallScore / 10) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">
                        {attempt.evaluation.overallScore} / 10
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="text-indigo-600 font-bold hover:underline text-xs">
                      Review Feedback →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Attempt Modal */}
      {activeDetailAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-slate-200 shadow-2xl relative space-y-6">
            <button
              onClick={() => setActiveDetailAttempt(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Historical Evaluation • {activeDetailAttempt.date}
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                {activeDetailAttempt.questionTitle}
              </h2>
            </div>

            <div className="p-4 bg-indigo-50/80 rounded-2xl flex justify-between items-center text-xs border border-indigo-100">
              <div>
                <span className="text-slate-600 font-medium">Overall AI Score: </span>
                <strong className="text-base text-indigo-700 ml-1 font-mono font-bold">
                  {activeDetailAttempt.evaluation.overallScore} / 10
                </strong>
              </div>
              <span className="font-bold text-indigo-700 uppercase tracking-wider text-xs">
                {activeDetailAttempt.evaluation.ratingLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="font-bold text-emerald-900">What you did well</div>
                <ul className="space-y-1 text-emerald-800 font-medium">
                  {activeDetailAttempt.evaluation.whatYouDidWell.map((w, idx) => (
                    <li key={idx}>• {w}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                <div className="font-bold text-rose-950">Areas for improvement</div>
                <ul className="space-y-1 text-rose-900 font-medium">
                  {activeDetailAttempt.evaluation.areasForImprovement.map((a, idx) => (
                    <li key={idx}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
                Your Submitted Answer:
              </h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                {activeDetailAttempt.studentAnswer}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setActiveDetailAttempt(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
