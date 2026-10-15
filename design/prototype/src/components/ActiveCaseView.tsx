import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Send,
  Calculator,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Table as TableIcon,
  Code,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { GuesstimateQuestion } from '../types';

interface ActiveCaseViewProps {
  question: GuesstimateQuestion;
  onBack: () => void;
  onSubmitAnswer: (answer: string, timeSpentSeconds: number) => Promise<void>;
  isEvaluating: boolean;
}

export const ActiveCaseView: React.FC<ActiveCaseViewProps> = ({
  question,
  onBack,
  onSubmitAnswer,
  isEvaluating,
}) => {
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [showDataPoints, setShowDataPoints] = useState<boolean>(true);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [scratchpadText, setScratchpadText] = useState<string>('');
  const [scratchpadCalc, setScratchpadCalc] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');

  // AI Hint Modal State
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [hintType, setHintType] = useState<
    'structure' | 'benchmark' | 'math' | 'synthesis'
  >('structure');
  const [aiHintText, setAiHintText] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);

  // Timer State (45 minutes = 2700s default)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    question.timeLimitMinutes * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Quick structure templates
  const insertTextAtCursor = (template: string) => {
    setStudentAnswer((prev) => (prev ? `${prev}\n\n${template}` : template));
  };

  const handleFetchHint = async () => {
    setIsLoadingHint(true);
    setAiHintText(null);
    try {
      const response = await fetch('/api/get-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: question.title,
          studentAnswer,
          hintType,
        }),
      });
      const data = await response.json();
      setAiHintText(data.hint);
    } catch (err) {
      setAiHintText(
        'Tip: Break down total demand into B2C consumer buyers and B2B institutional buyers.'
      );
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleEvaluateCalculator = () => {
    try {
      // Clean arithmetic expression
      const cleanExpr = scratchpadCalc.replace(/[^0-9+\-*/().]/g, '');
      if (!cleanExpr) return;
      // Evaluate basic arithmetic
      const evalFn = new Function(`return (${cleanExpr})`);
      const val = evalFn();
      setCalcResult(
        typeof val === 'number'
          ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
          : 'Error'
      );
    } catch (e) {
      setCalcResult('Invalid Expression');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Back to Setup"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                {question.categoryLabel}
              </span>
              <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider capitalize">
                {question.difficulty}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800">
              {question.title}
            </h1>
          </div>
        </div>

        {/* Live Timer Control */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-xl shrink-0 shadow-md">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-base font-bold tracking-wider">
            {formatTimer(secondsRemaining)}
          </span>
          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => {
                setSecondsRemaining(question.timeLimitMinutes * 60);
                setTimeSpentSeconds(0);
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Workspace / Right Drawers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Workspace Editor) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Collapsible Context & Data Points */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div
              onClick={() => setShowDataPoints(!showDataPoints)}
              className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Case Scenario & Key Reference Points
                </span>
              </div>
              {showDataPoints ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>

            {showDataPoints && (
              <div className="p-5 space-y-4 text-xs text-slate-700">
                <p className="leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 font-medium">
                  {question.contextPrompt}
                </p>

                {question.keyDataPoints && question.keyDataPoints.length > 0 && (
                  <div>
                    <div className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wide">
                      Provided Data Points:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {question.keyDataPoints.map((dp, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center"
                        >
                          <span className="text-slate-500 font-medium">{dp.label}</span>
                          <span className="font-mono font-bold text-indigo-600">
                            {dp.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Framework Shortcode Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none shadow-sm">
            <span className="text-slate-500 font-bold text-xs shrink-0">
              Shortcuts:
            </span>
            <button
              onClick={() =>
                insertTextAtCursor(
                  `## Framework Structure\n\n### 1. Scope & Clarification\n- \n\n### 2. Market Segmentation\n- \n\n### 3. Calculations & Math\n- \n\n### 4. Sanity Check\n- \n\n### 5. Executive Synthesis\n- `
                )
              }
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg shrink-0 border border-indigo-200 transition-colors"
            >
              + Full MECE Framework
            </button>
            <button
              onClick={() =>
                insertTextAtCursor(`### 1. Scope & Assumptions\n- Target population: \n- Penetration rate: `)
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg shrink-0 transition-colors"
            >
              + Step 1: Scope
            </button>
            <button
              onClick={() =>
                insertTextAtCursor(`### 2. Demand Segmentation\n- B2C Consumer: \n- B2B Institutional: `)
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg shrink-0 transition-colors"
            >
              + Step 2: Demand
            </button>
            <button
              onClick={() =>
                insertTextAtCursor(`### 3. Math & Calculations\n- Equation: \n- Final Calculation: `)
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg shrink-0 transition-colors"
            >
              + Step 3: Math
            </button>
            <button
              onClick={() =>
                insertTextAtCursor(`### 4. Executive Summary\n- Total Market Figure: \n- Top Driver & Recommendation: `)
              }
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg shrink-0 transition-colors"
            >
              + Step 4: Executive
            </button>
          </div>

          {/* Main Answer Editor Textarea */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Formatting Toolbar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => insertTextAtCursor('**Bold Text**')}
                  className="p-1.5 hover:bg-white rounded-lg hover:text-slate-900"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => insertTextAtCursor('*Italic Text*')}
                  className="p-1.5 hover:bg-white rounded-lg hover:text-slate-900"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1" />
                <button
                  onClick={() => insertTextAtCursor('- Item 1\n- Item 2\n- Item 3')}
                  className="p-1.5 hover:bg-white rounded-lg hover:text-slate-900"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => insertTextAtCursor('1. First Step\n2. Second Step\n3. Third Step')}
                  className="p-1.5 hover:bg-white rounded-lg hover:text-slate-900"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    insertTextAtCursor(
                      `| Segment | Population | Usage Rate | Total |\n|---|---|---|---|\n| Urban | 5M | 20% | 1M |\n| Rural | 4M | 10% | 400k |`
                    )
                  }
                  className="p-1.5 hover:bg-white rounded-lg hover:text-slate-900"
                  title="Insert Markdown Table"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium">
                <span>
                  {studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0} words
                </span>
                <span className="text-emerald-600 font-bold">✓ Draft saved</span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Structure your solution here... (e.g. State initial clarifications, outline your MECE demand branches, state explicit numerical assumptions, show calculations, and conclude with an executive synthesis)."
              rows={16}
              className="w-full p-5 md:p-6 text-sm text-slate-800 placeholder-slate-400 border-none focus:outline-none resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Bottom Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHintModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Get AI Hint</span>
              </button>

              <button
                onClick={() => setShowScratchpad(!showScratchpad)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Scratchpad Calculator</span>
              </button>
            </div>

            <button
              onClick={() => onSubmitAnswer(studentAnswer, timeSpentSeconds)}
              disabled={isEvaluating || studentAnswer.trim().length < 15}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Case...</span>
                </>
              ) : (
                <>
                  <span>Submit for Evaluation</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Suggested Structure & Mental Math Scratchpad */}
        <div className="space-y-4">
          {/* Suggested Structure Guide */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Recommended MECE Checklist</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {question.suggestedStructure.map((step, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed font-medium"
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Side Mental Math Scratchpad */}
          {(showScratchpad || true) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Mental Math Scratchpad</span>
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  Quick Arithmetic
                </span>
              </div>

              {/* Calculator input */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={scratchpadCalc}
                  onChange={(e) => setScratchpadCalc(e.target.value)}
                  placeholder="e.g. 9000000 * 0.05 * 24"
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-bold text-slate-800"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEvaluateCalculator}
                    className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={() => {
                      setScratchpadCalc('');
                      setCalcResult('');
                    }}
                    className="px-3.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {calcResult && (
                  <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl font-mono font-bold text-sm text-indigo-700 text-right">
                    = {calcResult}
                  </div>
                )}
              </div>

              {/* General scratch notes */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Private Rough Notes:
                </label>
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Jot down rough intermediate figures here..."
                  rows={4}
                  className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowHintModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">
                Ask Gemini AI Mentor
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Select where you feel stuck to receive a subtle guidance hint:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'structure', label: 'Framework & MECE' },
                  { id: 'benchmark', label: 'Data & Proxies' },
                  { id: 'math', label: 'Mental Arithmetic' },
                  { id: 'synthesis', label: 'Executive Summary' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setHintType(t.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-colors ${
                    hintType === t.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleFetchHint}
              disabled={isLoadingHint}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
            >
              {isLoadingHint ? 'Generating Hint...' : 'Get Hint'}
            </button>

            {aiHintText && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-slate-800 leading-relaxed">
                <strong className="text-indigo-700 block mb-1 font-bold">AI Mentor Guidance:</strong>
                {aiHintText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
