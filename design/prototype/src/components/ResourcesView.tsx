import React, { useState } from 'react';
import {
  Calculator,
  FileText,
  PieChart,
  Globe,
  GitFork,
  Search,
  Copy,
  Check,
  X,
  Sliders,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { CHEAT_SHEET_DATASHEET } from '../data/mockData';
import { StudentProfile } from '../types';

interface ResourcesViewProps {
  profile: StudentProfile;
  onStartPractice: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  profile,
  onStartPractice,
}) => {
  const [activeModal, setActiveModal] = useState<
    'approach' | 'datasheet' | 'tamsamsom' | 'marketsizing' | 'mece' | null
  >(null);

  // Datasheet search & region filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // TAM-SAM-SOM slider states
  const [tamTotal, setTamTotal] = useState<number>(1000000000); // $1B
  const [samPct, setSamPct] = useState<number>(30); // 30%
  const [somPct, setSomPct] = useState<number>(10); // 10% of SAM

  // MECE Interactive Tree toggle states
  const [meceBranch, setMeceBranch] = useState<'revenue' | 'cost' | 'market'>('revenue');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMetrics = CHEAT_SHEET_DATASHEET.filter((item) => {
    const matchesSearch =
      item.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion =
      selectedRegion === 'All' || item.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
            Welcome back, {profile.name}
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">
            Continue your preparation. Explore key frameworks and cheat sheets below.
          </p>
        </div>
        <div>
          <button
            onClick={onStartPractice}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <span>Start Practice Case</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: How to approach a guesstimate */}
        <div
          onClick={() => setActiveModal('approach')}
          className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
              How to approach a guesstimate
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Master the art of structured estimation with practical, step-by-step methodologies.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
            <span>Explore 5-Step Method</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 2: Datasheet */}
        <div
          onClick={() => setActiveModal('datasheet')}
          className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
              Datasheet
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Essential metrics, industry averages, and quick-reference data for rapid case solving.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
            <span>Open Reference Tables</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 3: TAM-SAM-SOM */}
        <div
          onClick={() => setActiveModal('tamsamsom')}
          className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
              TAM-SAM-SOM
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Frameworks for defining Total Addressable Market, Serviceable Available Market, and Serviceable Obtainable Market.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
            <span>Interactive Calculator</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 4: Market Sizing */}
        <div
          onClick={() => setActiveModal('marketsizing')}
          className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 shadow-xs">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
              Market Sizing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Techniques for evaluating market potential from top-down and bottom-up perspectives.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
            <span>Top-Down vs Bottom-Up</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 5: MECE Approach */}
        <div
          onClick={() => setActiveModal('mece')}
          className="group bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden md:col-span-2"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 mb-5 shadow-xs border border-indigo-100">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
              MECE Approach
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Deep dive into Mutually Exclusive, Collectively Exhaustive structuring. Learn how to break down complex problems into manageable, distinct components without overlap.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md font-bold text-xs uppercase tracking-wider">
                Core Framework
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md font-bold text-xs uppercase tracking-wider">
                Essential MBB Skill
              </span>
            </div>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-indigo-100 flex items-center text-xs font-bold text-indigo-600">
            <span>Build & Practice Tree Structure</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* --- MODALS FOR EACH CARD --- */}

      {/* 1. How to Approach a Guesstimate Modal */}
      {activeModal === 'approach' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#e2e8f0] shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#f1f5f9] text-[#64748b]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#e5eeff] rounded-lg text-[#1d4ed8]">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">
                  How to Approach a Consulting Guesstimate
                </h2>
                <p className="text-xs text-[#64748b]">The 5-Step MBB Gold Standard Framework</p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-[#1e293b]">
              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <h3 className="font-bold text-[#0b1c30] text-base mb-1">
                  1. Clarify & Bound the Problem
                </h3>
                <p className="text-xs text-[#475569]">
                  Never start calculating immediately! Ask 2-3 clarifying scope questions:
                  Geography (e.g., Greater London vs UK), Timeframe (Annual vs Daily), and Target Group (B2C consumers vs B2B institutions).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <h3 className="font-bold text-[#0b1c30] text-base mb-1">
                  2. Lay Out the MECE Tree Structure
                </h3>
                <p className="text-xs text-[#475569]">
                  State your high-level equation out loud before picking numbers:
                  <br />
                  <code className="block my-2 p-2 bg-[#0a192f] text-[#38bdf8] rounded font-mono text-xs">
                    Total Market = (Target Population × Adoption Rate × Annual Purchase Frequency) + Institutional Demand
                  </code>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <h3 className="font-bold text-[#0b1c30] text-base mb-1">
                  3. State Benchmark Assumptions & Run Math
                </h3>
                <p className="text-xs text-[#475569]">
                  Use clean, round benchmark figures (e.g. 330M for US, 9M for London, 70 years life expectancy). Keep mental arithmetic neat and write intermediate steps down.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <h3 className="font-bold text-[#0b1c30] text-base mb-1">
                  4. Sanity Check against Reality
                </h3>
                <p className="text-xs text-[#475569]">
                  Divide your final total by population to evaluate per-capita feasibility. Ask: "Does 0.4 units per person per year make sense?"
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#eff4ff] border border-[#1d4ed8]/30">
                <h3 className="font-bold text-[#1d4ed8] text-base mb-1">
                  5. Synthesize Executive Recommendation
                </h3>
                <p className="text-xs text-[#1e293b]">
                  Deliver a 30-second "So What?" for the engagement partner: state final number, mention top sensitivity driver (+/- 15%), and state 2 actionable strategic implications.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#e2e8f0] flex justify-end">
              <button
                onClick={() => {
                  setActiveModal(null);
                  onStartPractice();
                }}
                className="bg-[#1d4ed8] text-white px-5 py-2 rounded-md font-semibold text-xs hover:bg-[#1e40af]"
              >
                Practice A Case Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Datasheet Cheat Sheet Modal */}
      {activeModal === 'datasheet' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#e2e8f0] shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#f1f5f9] text-[#64748b]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#e5eeff] rounded-lg text-[#1d4ed8]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">
                  MBB Consulting Datasheet
                </h2>
                <p className="text-xs text-[#64748b]">
                  Essential benchmark figures, demographics, and unit conversion cheat sheet
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search metrics (e.g. Population, Coffee, Rent)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#1d4ed8]"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'US', 'UK', 'Europe', 'India', 'Global'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedRegion === r
                        ? 'bg-[#1d4ed8] text-white'
                        : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Table */}
            <div className="overflow-x-auto border border-[#e2e8f0] rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] text-[#64748b] border-b border-[#e2e8f0] font-semibold">
                    <th className="p-3">Metric</th>
                    <th className="p-3">Benchmark Value</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Region</th>
                    <th className="p-3">Note / Context</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[#1e293b]">
                  {filteredMetrics.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f8fafc]">
                      <td className="p-3 font-semibold text-[#0b1c30]">{m.metric}</td>
                      <td className="p-3 font-mono font-bold text-[#1d4ed8]">{m.value}</td>
                      <td className="p-3 text-[#64748b]">{m.category}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#1d4ed8] font-medium text-[10px]">
                          {m.region}
                        </span>
                      </td>
                      <td className="p-3 text-[#64748b] text-[11px]">{m.sourceOrNote}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => copyToClipboard(m.value, m.id)}
                          className="p-1.5 rounded hover:bg-[#e2e8f0] text-[#64748b] transition-colors"
                          title="Copy value"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-[#64748b]">
              <span>Tip: Always state your benchmark source clearly during live cases!</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#0a192f] text-white rounded-md font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAM-SAM-SOM Interactive Calculator Modal */}
      {activeModal === 'tamsamsom' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#e2e8f0] shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#f1f5f9] text-[#64748b]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#e5eeff] rounded-lg text-[#1d4ed8]">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">
                  TAM - SAM - SOM Interactive Visualizer
                </h2>
                <p className="text-xs text-[#64748b]">
                  Calibrate Total Addressable, Serviceable Available, and Obtainable Market
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Sliders & Controls */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0b1c30]">Total Addressable Market (TAM)</span>
                    <span className="text-[#1d4ed8] font-mono">${(tamTotal / 1e9).toFixed(1)}B</span>
                  </div>
                  <input
                    type="range"
                    min={100000000}
                    max={10000000000}
                    step={100000000}
                    value={tamTotal}
                    onChange={(e) => setTamTotal(Number(e.target.value))}
                    className="w-full accent-[#1d4ed8]"
                  />
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Total global/regional demand if 100% of potential buyers adopt.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0b1c30]">Serviceable Available Market (SAM %)</span>
                    <span className="text-[#0284c7] font-mono">{samPct}% (${((tamTotal * samPct) / 100 / 1e6).toFixed(0)}M)</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    value={samPct}
                    onChange={(e) => setSamPct(Number(e.target.value))}
                    className="w-full accent-[#0284c7]"
                  />
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Segment reachable within geography, compliance, or core product fit.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#0b1c30]">Serviceable Obtainable Market (SOM %)</span>
                    <span className="text-emerald-600 font-mono">
                      {somPct}% (${(((tamTotal * samPct) / 100 * somPct) / 100 / 1e6).toFixed(1)}M)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={somPct}
                    onChange={(e) => setSomPct(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[11px] text-[#64748b] mt-0.5">
                    Realistic market share captured over 3-5 years given competition.
                  </p>
                </div>
              </div>

              {/* Concentric Circles Visualizer */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* TAM Outer Circle */}
                  <div className="w-56 h-56 rounded-full bg-[#dce9ff] border-2 border-[#1d4ed8] flex items-top justify-center p-2 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-[#1d4ed8] uppercase tracking-wider">
                      TAM: ${(tamTotal / 1e9).toFixed(1)}B
                    </span>
                  </div>
                  {/* SAM Middle Circle */}
                  <div className="absolute w-40 h-40 rounded-full bg-[#bae6fd] border-2 border-[#0284c7] flex items-top justify-center p-2 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-[#0284c7] uppercase tracking-wider mt-1">
                      SAM: ${((tamTotal * samPct) / 100 / 1e6).toFixed(0)}M
                    </span>
                  </div>
                  {/* SOM Inner Circle */}
                  <div className="absolute w-24 h-24 rounded-full bg-[#a7f3d0] border-2 border-emerald-600 flex items-center justify-center p-2 text-center shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      SOM: ${(((tamTotal * samPct) / 100 * somPct) / 100 / 1e6).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#e2e8f0] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#1d4ed8] text-white rounded-md font-semibold text-xs"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Market Sizing Top-Down vs Bottom-Up Modal */}
      {activeModal === 'marketsizing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#e2e8f0] shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#f1f5f9] text-[#64748b]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#e5eeff] rounded-lg text-[#1d4ed8]">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">
                  Top-Down vs Bottom-Up Market Sizing
                </h2>
                <p className="text-xs text-[#64748b]">
                  Choosing the optimal direction for consulting interviews
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1e293b]">
              <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="font-bold text-sm text-[#1d4ed8] mb-2 flex items-center gap-2">
                  <span>Top-Down Method</span>
                  <span className="text-[10px] bg-[#eff4ff] text-[#1d4ed8] px-2 py-0.5 rounded">
                    Population Driven
                  </span>
                </div>
                <p className="text-[#475569] mb-4">
                  Starts with total macro population/country demographics and filters down using percentage adoption cuts.
                </p>
                <div className="p-3 bg-white rounded border border-[#e2e8f0] space-y-1 font-mono text-[11px]">
                  <div>Total Population (e.g. 330M)</div>
                  <div>↓ % Age Target (e.g. 60% = 198M)</div>
                  <div>↓ % Income Tier (e.g. 40% = 79M)</div>
                  <div>↓ % Penetration (e.g. 10% = 7.9M users)</div>
                  <div>× Price per unit = Total Market</div>
                </div>
                <div className="mt-3 text-[#64748b]">
                  <strong className="text-[#0b1c30]">Best for:</strong> B2C consumer products, apparel, streaming media, food & beverages.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="font-bold text-sm text-[#0284c7] mb-2 flex items-center gap-2">
                  <span>Bottom-Up Method</span>
                  <span className="text-[10px] bg-[#e0f2fe] text-[#0284c7] px-2 py-0.5 rounded">
                    Unit/Capacity Driven
                  </span>
                </div>
                <p className="text-[#475569] mb-4">
                  Starts with operational building blocks (number of stores, seats, hours, or units) and aggregates upwards.
                </p>
                <div className="p-3 bg-white rounded border border-[#e2e8f0] space-y-1 font-mono text-[11px]">
                  <div>Single Unit Output (e.g. $10k/day)</div>
                  <div>× Operating Days/Year (e.g. 300 = $3M)</div>
                  <div>× Total Locations in City (e.g. 15 = $45M)</div>
                  <div>× Regional Scale Factor = Total Market</div>
                </div>
                <div className="mt-3 text-[#64748b]">
                  <strong className="text-[#0b1c30]">Best for:</strong> B2B enterprise software, specialized clinics, commercial fleets, retail stores.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#e2e8f0] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#0a192f] text-white rounded-md font-semibold text-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MECE Approach Tree Builder Modal */}
      {activeModal === 'mece' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-[#e2e8f0] shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#f1f5f9] text-[#64748b]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#e5eeff] rounded-lg text-[#1d4ed8]">
                <GitFork className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">
                  Interactive MECE Tree Builder
                </h2>
                <p className="text-xs text-[#64748b]">
                  Mutually Exclusive (no overlap), Collectively Exhaustive (no gaps)
                </p>
              </div>
            </div>

            {/* Branch Switcher */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMeceBranch('revenue')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                  meceBranch === 'revenue'
                    ? 'bg-[#1d4ed8] text-white'
                    : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                Profit / Revenue Tree
              </button>
              <button
                onClick={() => setMeceBranch('cost')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                  meceBranch === 'cost'
                    ? 'bg-[#1d4ed8] text-white'
                    : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                Cost Reduction Tree
              </button>
              <button
                onClick={() => setMeceBranch('market')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${
                  meceBranch === 'market'
                    ? 'bg-[#1d4ed8] text-white'
                    : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                Market Entry Tree
              </button>
            </div>

            {/* Tree Visualization */}
            <div className="p-6 bg-[#0a192f] text-white rounded-xl border border-[#1e293b] font-mono text-xs overflow-x-auto">
              {meceBranch === 'revenue' && (
                <div className="space-y-4">
                  <div className="p-2 bg-[#1d4ed8] rounded text-center font-bold text-white max-w-xs mx-auto">
                    PROFIT = REVENUE - COST
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
                    <div className="p-3 bg-white/10 rounded border border-white/20 space-y-2">
                      <div className="font-bold text-[#38bdf8]">REVENUE DRIVERS</div>
                      <div className="pl-3 border-l-2 border-[#38bdf8] space-y-1 text-[#cbd5e1] text-[11px]">
                        <div>├── Price per Unit</div>
                        <div>└── Total Sales Volume</div>
                        <div className="pl-4 text-emerald-400">├── B2C Retail Volume</div>
                        <div className="pl-4 text-emerald-400">└── B2B Institutional Volume</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded border border-white/20 space-y-2">
                      <div className="font-bold text-amber-400">COST DRIVERS</div>
                      <div className="pl-3 border-l-2 border-amber-400 space-y-1 text-[#cbd5e1] text-[11px]">
                        <div>├── Fixed Costs (Rent, Salaries, IT)</div>
                        <div>└── Variable Costs (COGS, Shipping)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {meceBranch === 'cost' && (
                <div className="space-y-4">
                  <div className="p-2 bg-amber-600 rounded text-center font-bold text-white max-w-xs mx-auto">
                    TOTAL COST REDUCTION
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
                    <div className="p-3 bg-white/10 rounded border border-white/20 space-y-2">
                      <div className="font-bold text-amber-300">FIXED COSTS</div>
                      <div className="pl-3 border-l-2 border-amber-300 space-y-1 text-[#cbd5e1] text-[11px]">
                        <div>├── Real Estate / Facility Lease</div>
                        <div>├── Management Overhead & SG&A</div>
                        <div>└── Software / IT Licensing</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/10 rounded border border-white/20 space-y-2">
                      <div className="font-bold text-rose-400">VARIABLE COSTS</div>
                      <div className="pl-3 border-l-2 border-rose-400 space-y-1 text-[#cbd5e1] text-[11px]">
                        <div>├── Raw Material Input Prices</div>
                        <div>├── Direct Labor Hours / Efficiency</div>
                        <div>└── Logistics & Packaging</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {meceBranch === 'market' && (
                <div className="space-y-4">
                  <div className="p-2 bg-emerald-600 rounded text-center font-bold text-white max-w-xs mx-auto">
                    NEW MARKET ENTRY FEASIBILITY
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/20 text-[11px]">
                    <div className="p-2 bg-white/10 rounded border border-white/20 space-y-1">
                      <div className="font-bold text-emerald-300">1. MARKET ATTRACTIVENESS</div>
                      <div>• TAM size ($B)</div>
                      <div>• Growth Rate (%)</div>
                      <div>• Profit Margins</div>
                    </div>
                    <div className="p-2 bg-white/10 rounded border border-white/20 space-y-1">
                      <div className="font-bold text-sky-300">2. COMPETITIVE LANDSCAPE</div>
                      <div>• Market Concentration</div>
                      <div>• Entry Barriers</div>
                      <div>• Competitor Moats</div>
                    </div>
                    <div className="p-2 bg-white/10 rounded border border-white/20 space-y-1">
                      <div className="font-bold text-purple-300">3. CAPABILITIES & ROI</div>
                      <div>• Synergies</div>
                      <div>• Capital Required</div>
                      <div>• Payback Period</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-[#64748b]">
              <span>Golden Rule: Branches must not overlap and must sum to 100%!</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-[#1d4ed8] text-white rounded-md font-semibold text-xs"
              >
                Close Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
