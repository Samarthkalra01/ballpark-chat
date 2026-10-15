import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  PlusCircle,
  Building2,
  Check,
  Flame,
  Award,
  Download,
} from 'lucide-react';
import { NavigationTab, StudentProfile, TargetFirm } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onNewSession: () => void;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  profile,
  setProfile,
  onNewSession,
  onOpenMobileSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFirmSelector, setShowFirmSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const firms: TargetFirm[] = [
    'McKinsey & Company',
    'Boston Consulting Group',
    'Bain & Company',
    'Strategy&',
    'Oliver Wyman',
    'Roland Berger',
    'Big 4 Consulting',
  ];

  const getTitle = () => {
    switch (activeTab) {
      case 'resources':
        return 'Resources & Frameworks';
      case 'solve':
        return 'Practice Setup & Workspace';
      case 'past-performance':
        return 'Past Performance & AI Ratings';
      case 'settings':
        return 'Student Profile & Settings';
      case 'support':
        return 'Support & Case Interview Tips';
      default:
        return 'Ballpark Prep';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between text-slate-900">
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
          <span>{profile.streakDays} Day Streak</span>
        </div>

        {/* Target Firm Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowFirmSelector(!showFirmSelector)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-600 text-xs font-semibold text-slate-700 bg-slate-50 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{profile.targetFirm}</span>
          </button>

          {showFirmSelector && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-100">
                Select Target Firm
              </div>
              {firms.map((firm) => (
                <button
                  key={firm}
                  onClick={() => {
                    setProfile((prev) => ({ ...prev, targetFirm: firm }));
                    setShowFirmSelector(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-left text-slate-700 font-medium"
                >
                  <span>{firm}</span>
                  {profile.targetFirm === firm && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <span className="font-bold text-slate-800">Recent Activity</span>
                <span className="text-[10px] text-indigo-600 font-bold cursor-pointer">
                  Mark as read
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex gap-3 items-start p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <Award className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">Market Entry Rated 8/10</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      AI Evaluator analyzed your London Tennis case framework.
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-2.5 rounded-xl hover:bg-slate-50">
                  <Building2 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">Datasheet Updated</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      2026 UK & US demographic benchmarks refreshed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export / Download Zip Button */}
        <a
          href="/api/download-zip"
          download="ballpark-consulting-prep.zip"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
          title="Download complete project source code as .ZIP"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export ZIP</span>
        </a>

        {/* New Session Button */}
        <button
          onClick={onNewSession}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
};
