import React from 'react';
import { 
  Menu, 
  Mic, 
  Star, 
  Settings, 
  Keyboard, 
  Sun, 
  Moon, 
  History 
} from 'lucide-react';
import { SelectedView } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { MENU_GROUPS } from './Sidebar';

interface HeaderProps {
  selectedView: SelectedView;
  theme: 'dark' | 'light';
  handleToggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setVoiceAssistantOpen: (open: boolean) => void;
  setHubOpen: (open: boolean) => void;
  setHubTab: (tab: 'settings' | 'bookmarks') => void;
  favoritesCount: number;
  historyCount: number;
  historyOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
  readingProgress: number;
}

export default function Header({
  selectedView,
  theme,
  handleToggleTheme,
  setSidebarOpen,
  setVoiceAssistantOpen,
  setHubOpen,
  setHubTab,
  favoritesCount,
  historyCount,
  historyOpen,
  setHistoryOpen,
  setShortcutsOpen,
  readingProgress,
}: HeaderProps) {
  const currentLabel = React.useMemo(() => {
    return MENU_GROUPS.flatMap((g) => g.items).find((i) => i.id === selectedView)?.label || 'Suite';
  }, [selectedView]);

  return (
    <header
      className={`sticky top-0 z-30 px-4 sm:px-6 py-4 border-b flex flex-col justify-between backdrop-blur-xl ${
        theme === 'dark' ? 'bg-[#060813]/80 border-[#151b2d]' : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        {/* Left Section: Mobile Menu Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic();
              setSidebarOpen(true);
            }}
            className="lg:hidden p-2 hover:bg-[#1a1d2e] border border-transparent hover:border-[#282f4e] rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer transition-all duration-200"
            title="Toggle main menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-200 tracking-wider font-mono uppercase bg-gradient-to-r from-purple-950/40 to-indigo-950/40 px-2.5 py-1.5 rounded-lg border border-purple-800/20 shadow-[inset_0_0_8px_rgba(168,85,247,0.1)]">
              Radix<span className="text-fuchsia-500 font-extrabold">Lab</span>
            </span>
            <span className="text-slate-600 text-xs font-mono">➔</span>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest font-mono bg-indigo-950/20 px-2.5 py-1 rounded border border-indigo-900/10">
              {currentLabel}
            </span>
          </div>
        </div>

        {/* Right Section: Core Controls & Utility Actions */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-2.5 justify-end">
          {/* Voice assistant dictation */}
          <button
            onClick={() => {
              triggerHaptic();
              setVoiceAssistantOpen(true);
            }}
            className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(217,70,239,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Voice assistant dictation guideline commands helper"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block">Dictation</span>
          </button>

          {/* Bookmarks Favorites Button */}
          <button
            onClick={() => {
              triggerHaptic();
              setHubTab('bookmarks');
              setHubOpen(true);
            }}
            className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Open saved bookmarks list"
          >
            <Star className="w-3.5 h-3.5" />
            {favoritesCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-mono text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {favoritesCount}
              </span>
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block">Bookmarks</span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => {
              triggerHaptic();
              setHubTab('settings');
              setHubOpen(true);
            }}
            className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(217,70,239,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Device haptics and configuration hub"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block">Settings</span>
          </button>

          {/* Keyboard Shortcuts Dialog */}
          <button
            onClick={() => {
              triggerHaptic();
              setShortcutsOpen(true);
            }}
            className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(99,102,241,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="View Keyboard Hotkeys helper"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block font-sans">Hotkeys</span>
          </button>

          {/* Theme Switcher trigger */}
          <button
            onClick={() => {
              triggerHaptic();
              handleToggleTheme();
            }}
            className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-sky-500/50 text-slate-400 hover:text-sky-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Toggle screen light/dark visual theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Collapsible history slide-out drawer trigger */}
          <button
            onClick={() => {
              triggerHaptic();
              setHistoryOpen(!historyOpen);
            }}
            className={`p-2 rounded border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              historyOpen 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                : 'bg-[#10121d] hover:bg-[#151929] border-[#1f243a] hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.25)]'
            }`}
            title="Toggle historic conversions log panel"
          >
            <History className="w-3.5 h-3.5" />
            {historyCount > 0 && (
              <span className="bg-fuchsia-500 text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full font-black">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Live Reading Progress Slider Bar */}
      <div className="w-full h-[2px] bg-slate-950 absolute bottom-0 left-0 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-150 animate-pulse"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
    </header>
  );
}
