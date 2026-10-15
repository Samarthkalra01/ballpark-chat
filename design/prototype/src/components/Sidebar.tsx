import React from 'react';
import {
  BookOpen,
  Brain,
  BarChart3,
  Settings,
  HelpCircle,
  Play,
  X,
  Menu,
} from 'lucide-react';
import { NavigationTab, StudentProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  profile: StudentProfile;
  onStartCase: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onStartCase,
  isOpenMobile,
  setIsOpenMobile, }) => {
  const navItems = [
    {
      id: 'resources' as NavigationTab,
      label: 'Resources',
      icon: BookOpen,
      badge: 'Guide',
    },
    {
      id: 'solve' as NavigationTab,
      label: 'Solve',
      icon: Brain,
      badge: 'Live',
    },
    {
      id: 'past-performance' as NavigationTab,
      label: 'Past Performance',
      icon: BarChart3,
      badge: undefined,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4 bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      {/* Brand Header with Sleek Icon */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <div className="w-4 h-4 bg-white rounded-xs rotate-45" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-white">Ballpark</span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
              Pro
            </span>
          </div>
          <span className="text-xs text-slate-400">Consulting Career Intelligence</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* CTA Button */}
      <div className="my-6 px-1">
        <button
          onClick={() => {
            onStartCase();
            setIsOpenMobile(false);
          }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Case</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="mb-4 p-3 bg-slate-800/70 rounded-xl border border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
          {profile.name.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-bold text-white truncate">{profile.name}</span>
          <span className="text-[10px] text-slate-400 truncate">{profile.targetFirm}</span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800 space-y-1">
        <button
          onClick={() => {
            setActiveTab('settings');
            setIsOpenMobile(false);
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('support');
            setIsOpenMobile(false);
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'support'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Support & Guidelines</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (280px) */}
      <aside className="hidden lg:block w-[280px] fixed top-0 left-0 bottom-0 z-40 border-r border-slate-800 bg-slate-900">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-[280px] bg-slate-900 h-full z-10 shadow-2xl flex flex-col">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg bg-slate-800"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
