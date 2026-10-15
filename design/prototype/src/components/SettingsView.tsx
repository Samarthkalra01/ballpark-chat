import React from 'react';
import { User, Building2, GraduationCap, Calendar, Save, Check, Download, FileArchive, Terminal, CheckCircle2 } from 'lucide-react';
import { StudentProfile, TargetFirm } from '../types';

interface SettingsViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  setProfile,
}) => {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const firms: TargetFirm[] = [
    'McKinsey & Company',
    'Boston Consulting Group',
    'Bain & Company',
    'Strategy&',
    'Oliver Wyman',
    'Roland Berger',
    'Big 4 Consulting',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-800">Student Profile & Target Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your target firm, recruitment intake timeline, and personal candidate profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        {/* Profile Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Candidate Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile((p) => ({ ...p, university: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Recruitment Target Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Recruitment Targets</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Target Firm
              </label>
              <select
                value={profile.targetFirm}
                onChange={(e) => setProfile((p) => ({ ...p, targetFirm: e.target.value as TargetFirm }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              >
                {firms.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Intake Year
              </label>
              <input
                type="text"
                value={profile.targetYear}
                onChange={(e) => setProfile((p) => ({ ...p, targetYear: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes are applied instantly to case evaluation context</span>
          )}

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Export Source Code Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <FileArchive className="w-4 h-4 text-indigo-600" />
              <span>Export Project Source Code (.ZIP)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Download the complete Ballpark Consulting Prep application bundle for offline development or local hosting.
            </p>
          </div>
          <a
            href="/api/download-zip"
            download="ballpark-consulting-prep.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download .ZIP (80 KB)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Included Files & Structure</span>
            </span>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              <li>Full React + TypeScript UI (`src/`)</li>
              <li>Express API backend server (`server.ts`)</li>
              <li>Case libraries, benchmarks & frameworks (`mockData.ts`)</li>
              <li>Vite, Tailwind CSS & TS configuration files</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Local Quickstart</span>
            </span>
            <div className="text-[11px] font-mono bg-slate-900 text-slate-200 p-2.5 rounded-lg space-y-1 overflow-x-auto">
              <p># 1. Unzip the archive</p>
              <p>unzip ballpark-consulting-prep.zip</p>
              <p># 2. Install dependencies & run</p>
              <p>npm install && npm run dev</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
