import React, { useState } from 'react';
import {
  TrendingUp,
  Calculator,
  Globe,
  Lightbulb,
  ArrowRight,
  Sparkles,
  ListFilter,
  Check,
  BookOpen,
} from 'lucide-react';
import { INITIAL_QUESTIONS } from '../data/mockData';
import {
  DifficultyLevel,
  GuesstimateQuestion,
  QuestionCategory,
} from '../types';

interface PracticeSetupViewProps {
  onSelectQuestion: (question: GuesstimateQuestion) => void;
  onGenerateCustomQuestion: (
    category: QuestionCategory,
    difficulty: DifficultyLevel,
    region: string,
    industry: string
  ) => Promise<void>;
  isGenerating: boolean;
}

export const PracticeSetupView: React.FC<PracticeSetupViewProps> = ({
  onSelectQuestion,
  onGenerateCustomQuestion,
  isGenerating,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<QuestionCategory>('market-sizing');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>('medium');
  const [selectedRegion, setSelectedRegion] = useState<string>('UK / London');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Sports & Retail');
  const [activeTab, setActiveTab] = useState<'setup' | 'library'>('setup');

  const categories = [
    {
      id: 'revenue-profit' as QuestionCategory,
      title: 'Revenue/Profit Estimation',
      description:
        'Focus on drivers of profitability, cost reduction, and pricing strategies.',
      icon: TrendingUp,
    },
    {
      id: 'mathematical' as QuestionCategory,
      title: 'Mathematical',
      description:
        'Data interpretation, rapid mental math, and chart analysis.',
      icon: Calculator,
    },
    {
      id: 'market-sizing' as QuestionCategory,
      title: 'Market Sizing',
      description:
        'Guesstimation techniques, demographic proxies, and top-down vs bottom-up logic.',
      icon: Globe,
    },
    {
      id: 'unconventional' as QuestionCategory,
      title: 'Unconventional',
      description:
        'Abstract problem solving, brainteasers, and creative structuring.',
      icon: Lightbulb,
    },
  ];

  const handleGenerate = () => {
    onGenerateCustomQuestion(
      selectedCategory,
      selectedDifficulty,
      selectedRegion,
      selectedIndustry
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Selector: Setup Generator vs Case Library */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Practice Setup</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure a targeted session or choose from our curated MBB case library.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'setup'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom Practice Setup
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'library'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Case Library ({INITIAL_QUESTIONS.length})
          </button>
        </div>
      </div>

      {activeTab === 'setup' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
          {/* Section 1: Categories */}
          <section>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                What do you want to practice?
              </h3>
              <p className="text-xs text-slate-500">
                Select a core consulting framework or case type to focus your session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Section 2: Difficulty & Region */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Difficulty Level
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrate the complexity of the scenario and data granularity.
                </p>
              </div>

              {/* Difficulty Segmented Radio Control */}
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto">
                {(['easy', 'medium', 'challenging'] as DifficultyLevel[]).map(
                  (diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex-1 md:w-28 py-2 px-4 rounded-lg text-xs font-bold capitalize transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-white text-indigo-600 shadow-xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {diff}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Region & Industry Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Target Region / Geography
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                >
                  <option value="UK / London">UK / Greater London</option>
                  <option value="US / New York">US / New York & North America</option>
                  <option value="Europe / Berlin">Europe / EU Markets</option>
                  <option value="India / Emerging">India & Emerging Asia</option>
                  <option value="Global">Global / Multi-Region</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Target Industry Sector
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                >
                  <option value="Sports & Retail">Sports & Retail Goods</option>
                  <option value="Hospitality & Dining">Hospitality, Dining & Food</option>
                  <option value="Transit & Energy">Transit, Automotive & Energy</option>
                  <option value="Consumer Tech">Consumer Tech & Electronics</option>
                  <option value="Healthcare & SaaS">Healthcare & Enterprise SaaS</option>
                  <option value="Aviation & Travel">Aviation, Logistics & Travel</option>
                </select>
              </div>
            </div>
          </section>

          {/* Action Area */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Powered by Gemini AI consulting case generation engine</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Question...</span>
                </>
              ) : (
                <>
                  <span>Generate Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Case Library Tab */
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              Browse {INITIAL_QUESTIONS.length} curated MBB partner questions
            </span>
            <span className="text-slate-500">Select any case to start immediately</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {INITIAL_QUESTIONS.map((q) => (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q)}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-400 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-md uppercase tracking-wider">
                      {q.categoryLabel}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        q.difficulty === 'easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    {q.region && (
                      <span className="text-xs text-slate-500 font-medium">
                        • {q.region}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {q.contextPrompt}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-700 transition-all shadow-xs">
                    <span>Solve Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
