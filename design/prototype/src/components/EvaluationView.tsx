import React, { useState } from 'react';
import {
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { AIEvaluationResult, GuesstimateQuestion } from '../types';

interface EvaluationViewProps {
  question: GuesstimateQuestion;
  studentAnswer: string;
  evaluation: AIEvaluationResult;
  onPracticeAnother: () => void;
  onViewPastPerformance: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  question,
  studentAnswer,
  evaluation,
  onPracticeAnother,
  onViewPastPerformance,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'solution'>('feedback');

  // Score gauge math
  const score = evaluation.overallScore || 8;
  const percentage = (score / 10) * 100;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner Card with Score Gauge */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-6 text-center md:text-left">
            {/* Circular Gauge SVG */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="text-slate-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{score}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  / 10
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  AI Rating • Latest Case
                </span>
                <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  {question.categoryLabel}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                {evaluation.ratingLabel}
              </h1>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                {evaluation.feedbackSummary}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onPracticeAnother}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Another Case</span>
            </button>
            <button
              onClick={onViewPastPerformance}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Past Performance</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'feedback'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Feedback & Rubric Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'solution'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>MBB Benchmark Model Solution</span>
          </button>
        </div>

        {activeTab === 'feedback' ? (
          <div className="space-y-6 pt-2">
            {/* Two Column Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Green Card: What You Did Well */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>What you did well</span>
                </div>
                <ul className="space-y-3 text-xs text-emerald-800 leading-relaxed font-medium">
                  {evaluation.whatYouDidWell.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red/Pink Card: Areas for Improvement */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                  <TrendingUp className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Areas for improvement</span>
                </div>
                <ul className="space-y-3 text-xs text-rose-900 leading-relaxed font-medium">
                  {evaluation.areasForImprovement.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rubric Score Breakdown Bars */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                MBB Partner Rubric Breakdown
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>1. MECE Structuring</span>
                    <span className="text-indigo-600">
                      {evaluation.rubric?.structuringScore || 2.8} / 3.0
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${((evaluation.rubric?.structuringScore || 2.8) / 3) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>2. Benchmarks & Proxies</span>
                    <span className="text-indigo-600">
                      {evaluation.rubric?.benchmarksScore || 2.5} / 3.0
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${((evaluation.rubric?.benchmarksScore || 2.5) / 3) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>3. Mental Arithmetic</span>
                    <span className="text-indigo-600">
                      {evaluation.rubric?.mathScore || 2.0} / 2.0
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${((evaluation.rubric?.mathScore || 2.0) / 2) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                    <span>4. Executive Synthesis</span>
                    <span className="text-indigo-600">
                      {evaluation.rubric?.synthesisScore || 1.7} / 2.0
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full"
                      style={{
                        width: `${((evaluation.rubric?.synthesisScore || 1.7) / 2) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Model Comparison Note */}
            {evaluation.modelComparison && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-slate-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-700 block mb-0.5 font-bold">
                    Model Benchmark Comparison:
                  </strong>
                  <span className="leading-relaxed">{evaluation.modelComparison}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MBB Model Solution View */
          <div className="space-y-6 pt-2 text-xs text-slate-800">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 className="font-bold text-sm text-slate-800 mb-2">
                Executive Model Summary
              </h3>
              <p className="leading-relaxed text-slate-600">
                {question.modelAnswer.summary}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Step-by-Step Benchmark Calculations
              </h3>
              {question.modelAnswer.stepByStep.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2"
                >
                  <div className="font-bold text-xs text-indigo-600">
                    {step.title}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{step.detail}</p>
                  {step.calculation && (
                    <div className="p-3 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-800 font-bold">
                      {step.calculation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
              <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-700 mb-1">
                Sanity Check & Feasibility
              </h3>
              <p className="text-slate-800 leading-relaxed font-medium">
                {question.modelAnswer.sanityCheck}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
