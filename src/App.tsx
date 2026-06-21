/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SelectedView, ConversionRecord } from './types';
import ErrorBoundary from './components/ErrorBoundary';

// View Imports
import ConverterView from './components/ConverterView';
import CalculatorView from './components/CalculatorView';
import SignedComplementView from './components/SignedComplementView';
import IEEE754View from './components/IEEE754View';
import EducationalView from './components/EducationalView';
import HistoryView from './components/HistoryView';
import ScientificCalculatorView from './components/ScientificCalculatorView';
import BatchConvertView from './components/BatchConvertView';
import AsciiUnicodeView from './components/AsciiUnicodeView';
import ColorConverterView from './components/ColorConverterView';
import HashGeneratorView from './components/HashGeneratorView';
import Base64View from './components/Base64View';
import UuidGeneratorView from './components/UuidGeneratorView';
import RegexTesterView from './components/RegexTesterView';
import BitPatternsView from './components/BitPatternsView';
import NumberLineView from './components/NumberLineView';
import BinaryTreeView from './components/BinaryTreeView';
import BytesBitsView from './components/BytesBitsView';
import AnalyticsView from './components/AnalyticsView';
import VoiceDictationModal from './components/VoiceDictationModal';
import LegalModal from './components/LegalModal';
import { motion, AnimatePresence } from 'motion/react';

import {
  Sparkles,
  Cpu,
  ToggleLeft,
  GraduationCap,
  Calculator,
  Moon,
  Sun,
  Menu,
  X,
  History,
  Info,
  Layers,
  Binary,
  Palette,
  ShieldCheck,
  Code,
  Key,
  Sliders,
  GitCommit,
  Database,
  Keyboard,
  HelpCircle,
  Star,
  Trash2,
  Smartphone,
  Volume2,
  VolumeX,
  Check,
  CheckCircle2,
  Send,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  Mic,
  MicOff,
  Settings,
  BarChart3
} from 'lucide-react';
import { triggerHaptic, triggerSuccessBeep } from './utils/haptics';
import { parseSpeechToNumber } from './utils/speech';

interface MenuGroup {
  section: string;
  items: {
    id: SelectedView;
    label: string;
    icon: any;
    color: string;
  }[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    section: 'Main Features',
    items: [
      { id: 'converter', label: 'Base Converter', icon: Sparkles, color: 'text-indigo-400' },
      { id: 'calculator', label: 'Base Calculator', icon: Calculator, color: 'text-indigo-400' },
      { id: 'scientific', label: 'Scientific Calc', icon: Calculator, color: 'text-indigo-400' },
      { id: 'batch', label: 'Batch Convert', icon: Layers, color: 'text-indigo-400' },
      { id: 'analytics', label: 'Telemetry Diagnostics', icon: BarChart3, color: 'text-indigo-400' },
      { id: 'learn', label: 'Quiz & Practice', icon: GraduationCap, color: 'text-indigo-400' },
    ],
  },
  {
    section: 'Developer Tools',
    items: [
      { id: 'ieee754', label: 'IEEE 754 float', icon: Cpu, color: 'text-indigo-400' },
      { id: 'signed', label: "Two's Complement", icon: ToggleLeft, color: 'text-indigo-400' },
      { id: 'ascii', label: 'ASCII / Unicode', icon: Binary, color: 'text-indigo-400' },
      { id: 'color', label: 'Color Converter', icon: Palette, color: 'text-indigo-400' },
      { id: 'hash', label: 'Hash Generator', icon: ShieldCheck, color: 'text-indigo-400' },
      { id: 'base64', label: 'Base64 Encoder', icon: Code, color: 'text-indigo-400' },
      { id: 'uuid', label: 'UUID Generator', icon: Key, color: 'text-indigo-400' },
      { id: 'regex', label: 'Regex Tester', icon: Code, color: 'text-indigo-400' },
    ],
  },
  {
    section: 'Visualization',
    items: [
      { id: 'bitpatterns', label: 'Bit Patterns', icon: Sliders, color: 'text-indigo-400' },
      { id: 'numberline', label: 'Number Line', icon: Sliders, color: 'text-indigo-400' },
      { id: 'binarytree', label: 'Binary Tree', icon: GitCommit, color: 'text-indigo-400' },
    ],
  },
  {
    section: 'Unit Converters',
    items: [
      { id: 'bytesbits', label: 'Bytes & Bits', icon: Database, color: 'text-indigo-400' },
    ],
  },
];

export default function App() {
  const [selectedView, setSelectedView] = React.useState<SelectedView>('converter');
  const [history, setHistory] = React.useState<ConversionRecord[]>([]);

  // Load history from state context into active converter view
  const [activeConverterRecord, setActiveConverterRecord] = React.useState<{
    input: string;
    fromBase: number;
    toBase: number;
  } | null>(null);

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [legalOpen, setLegalOpen] = React.useState(false);
  const [legalTab, setLegalTab] = React.useState<'terms' | 'privacy' | 'cookies' | 'license'>('terms');
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [readingProgress, setReadingProgress] = React.useState(0);

  // Auto-Save settings & favorites states
  const [hubOpen, setHubOpen] = React.useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = React.useState(false);
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [toast, setToast] = React.useState<string | null>(null);
  
  const [settings, setSettings] = React.useState({
    hapticsEnabled: true,
    soundEnabled: true,
    autoCopy: false,
    themeStyle: 'cosmic-dark'
  });

  // Load settings and favorites on start
  const loadFavorites = () => {
    const saved = localStorage.getItem('adv_num_conv_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch(e) {}
    } else {
      setFavorites([]);
    }
  };

  React.useEffect(() => {
    loadFavorites();
    window.addEventListener('favorites-updated', loadFavorites);
    return () => window.removeEventListener('favorites-updated', loadFavorites);
  }, []);

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('adv_num_conv_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    triggerHaptic();
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem('adv_num_conv_settings', JSON.stringify(next));
    showToast(`Setting updated and Saved!`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectFavorite = (fav: any) => {
    triggerHaptic();
    setSelectedView('converter');
    setActiveConverterRecord({
      input: fav.input,
      fromBase: fav.fromBase,
      toBase: fav.toBase
    });
    setHubOpen(false);
    triggerSuccessBeep();
    showToast(`Loaded Favorite Conversion!`);
  };

  const handleDeleteFavorite = (id: string) => {
    triggerHaptic();
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('adv_num_conv_favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('favorites-updated'));
    showToast(`Bookmark deleted!`);
  };

  // Load state from localStorage on init
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('adv_num_conv_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // Safe fallback
      }
    }
    const savedTheme = localStorage.getItem('adv_num_conv_theme');
    if (savedTheme === 'light') {
      setTheme('light');
    }
  }, []);

  // Set real reading progress on scroll of main container
  React.useEffect(() => {
    const mainEl = document.getElementById('main-scroll-container');
    const handleScroll = () => {
      if (mainEl) {
        const { scrollTop, scrollHeight, clientHeight } = mainEl;
        const progress = scrollHeight - clientHeight > 0
          ? (scrollTop / (scrollHeight - clientHeight)) * 100
          : 0;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
    }
    // Set initially
    handleScroll();
    return () => {
      if (mainEl) mainEl.removeEventListener('scroll', handleScroll);
    };
  }, [selectedView]);

  // Handle global keyboard shortcuts listeners
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if user is active in an input/textarea/select/editable field
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        (activeEl as any).isContentEditable
      );

      if (isTyping) {
        return;
      }

      // Check for arrow keys to cycle menu sections
      const allItems = MENU_GROUPS.flatMap(group => group.items);
      const currentIndex = allItems.findIndex(item => item.id === selectedView);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % allItems.length;
        const nextItem = allItems[nextIndex];
        if (nextItem) {
          triggerHaptic();
          setSelectedView(nextItem.id);
          setActiveConverterRecord(null);
          showToast(`Switching to: ${nextItem.label}`);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
        const prevItem = allItems[prevIndex];
        if (prevItem) {
          triggerHaptic();
          setSelectedView(prevItem.id);
          setActiveConverterRecord(null);
          showToast(`Switching to: ${prevItem.label}`);
        }
      } else if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case '1':
            setSelectedView('converter');
            break;
          case '2':
            setSelectedView('calculator');
            break;
          case '3':
            setSelectedView('scientific');
            break;
          case '4':
            setSelectedView('batch');
            break;
          case '5':
            setSelectedView('learn');
            break;
          case 'f':
            setSelectedView('ieee754');
            break;
          case 't':
            setSelectedView('signed');
            break;
          case 'b':
            setSelectedView('bitpatterns');
            break;
          case 'h':
            setSelectedView('hash');
            break;
          case 'k':
            setShortcutsOpen((prev) => !prev);
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedView]);

  // Save history on changes
  const saveHistory = (newHistory: ConversionRecord[]) => {
    setHistory(newHistory);
    localStorage.setItem('adv_num_conv_history', JSON.stringify(newHistory));
  };

  const handleAddHistory = (input: string, fromBase: number, toBase: number, result: string) => {
    // Avoid duplicate insertions
    const isDuplicate = history.some(
      (item) =>
        item.input === input &&
        item.fromBase === fromBase &&
        item.toBase === toBase &&
        item.result === result
    );
    if (isDuplicate) return;

    const newRecord: ConversionRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      input,
      fromBase,
      toBase,
      result,
    };
    saveHistory([newRecord, ...history.slice(0, 99)]); // Limit history records count safely to 100 entries
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleRemoveRecord = (id: string) => {
    saveHistory(history.filter((h) => h.id !== id));
  };

  const handleSelectRecord = (record: ConversionRecord) => {
    setSelectedView('converter');
    setActiveConverterRecord({
      input: record.input,
      fromBase: record.fromBase,
      toBase: record.toBase,
    });
    // Close sliders on smaller viewports
    setHistoryOpen(false);
    setSidebarOpen(false);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('adv_num_conv_theme', nextTheme);
  };

  // Rendering matching views
  const renderActiveView = () => {
    switch (selectedView) {
      case 'converter':
        return (
          <ConverterView
            initialInput={activeConverterRecord?.input}
            initialFromBase={activeConverterRecord?.fromBase}
            initialToBase={activeConverterRecord?.toBase}
            onAddHistory={handleAddHistory}
          />
        );
      case 'calculator':
        return <CalculatorView />;
      case 'signed':
        return <SignedComplementView />;
      case 'ieee754':
        return <IEEE754View />;
      case 'learn':
        return <EducationalView />;
      case 'scientific':
        return <ScientificCalculatorView />;
      case 'batch':
        return <BatchConvertView />;
      case 'ascii':
        return <AsciiUnicodeView />;
      case 'color':
        return <ColorConverterView />;
      case 'hash':
        return <HashGeneratorView />;
      case 'base64':
        return <Base64View />;
      case 'uuid':
        return <UuidGeneratorView />;
      case 'regex':
        return <RegexTesterView />;
      case 'bitpatterns':
        return <BitPatternsView />;
      case 'numberline':
        return <NumberLineView />;
      case 'binarytree':
        return <BinaryTreeView />;
      case 'bytesbits':
        return <BytesBitsView />;
      case 'analytics':
        return <AnalyticsView history={history} onClearHistory={handleClearHistory} />;
      default:
        return (
          <ConverterView
            initialInput={activeConverterRecord?.input}
            initialFromBase={activeConverterRecord?.fromBase}
            initialToBase={activeConverterRecord?.toBase}
            onAddHistory={handleAddHistory}
          />
        );
    }
  };

  return (
    <ErrorBoundary theme={theme}>
      <div className={`h-screen w-screen overflow-hidden font-sans antialiased flex flex-col relative transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#04060c] text-slate-100' : 'bg-slate-50 text-slate-700'
      }`}>
        {/* Ambient background decorative glow circles for the premium viral look */}
        {theme === 'dark' ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[40%] -left-[20%] w-[90%] h-[90%] rounded-full bg-indigo-500/15 blur-[120px] animate-pulse duration-[10s]" />
            <div className="absolute -bottom-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-fuchsia-600/10 blur-[150px] animate-pulse duration-[8s]" />
            <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[100px]" />
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-100/45 blur-[90px]" />
            <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-[110px]" />
          </div>
        )}

        {/* Desktop Container Wrapper */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative z-10">
          {/* Persistent Desktop Sidebar */}
          <aside className={`w-[260px] border-r flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 ${
            theme === 'dark' ? 'bg-[#060813]/85 backdrop-blur-xl border-[#151b2d]' : 'bg-white/95 backdrop-blur-xl border-slate-200'
          }`}>
            <div className="p-6 border-b border-[#1d2130] flex items-center justify-between col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-fuchsia-500 to-indigo-500 rounded flex items-center justify-center font-bold text-white text-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                  RL
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-slate-100 tracking-wider font-mono uppercase">
                    Radix<span className="text-fuchsia-500 font-black">Lab</span>
                  </h1>
                  <span className="text-[9px] text-indigo-400 font-mono font-bold block uppercase tracking-widest">
                    Converter Suite
                  </span>
                </div>
              </div>
            </div>

            <nav className="p-4 flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
              {MENU_GROUPS.map((group) => (
                <div key={group.section} className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block px-4 mb-2">
                    {group.section}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          triggerHaptic();
                          setSelectedView(item.id);
                          setActiveConverterRecord(null); // Clear past records on manual shifts
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer justify-start text-left relative overflow-hidden ${
                          isActive
                            ? theme === 'dark'
                              ? 'bg-gradient-to-r from-purple-950/40 to-indigo-950/20 text-fuchsia-300 font-bold border-l-4 border-fuchsia-500 shadow-[inset_1px_0_12px_rgba(217,70,239,0.15)]'
                              : 'bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold'
                            : theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {isActive && theme === 'dark' && (
                          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-fuchsia-500 to-indigo-500" />
                        )}
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-fuchsia-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-[#1d2130] text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
              <span>DLD LAB STATION V2.1</span>
            </div>
          </aside>

          {/* Main Framework Frame */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Dynamic Top Header (Responsive and brand-aligned) */}
            <header className={`sticky top-0 z-30 px-4 sm:px-6 py-4.5 border-b flex flex-col justify-between backdrop-blur-xl ${
              theme === 'dark' ? 'bg-[#060813]/80 border-[#151b2d]' : 'bg-white/80 border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                {/* Left: Breadcrumbs & Menu */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { triggerHaptic(); setSidebarOpen(true); }}
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
                      {MENU_GROUPS.flatMap(g => g.items).find(i => i.id === selectedView)?.label || 'Suite'}
                    </span>
                  </div>
                </div>

                {/* Right: Comprehensive shortcuts bar (Exclusively visible on Desktop/lg) */}
                <div className="hidden lg:flex items-center gap-2 sm:gap-2.5 justify-end">
                  {/* Voice assistant dictation guide button */}
                  <button
                    onClick={() => { triggerHaptic(); setVoiceAssistantOpen(true); }}
                    className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(217,70,239,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    title="Voice assistant dictation guideline commands helper"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block">Dictation</span>
                  </button>

                  {/* Bookmarks Favorites Console shortcut */}
                  <button
                    onClick={() => { triggerHaptic(); setHubOpen(true); }}
                    className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    title="Open saved bookmarks list"
                  >
                    <Star className="w-3.5 h-3.5" />
                    {favorites.length > 0 && (
                      <span className="bg-amber-500 text-slate-950 font-mono text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                        {favorites.length}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block">Bookmarks</span>
                  </button>

                  {/* Control Hub settings drawer shortcut */}
                  <button
                    onClick={() => { triggerHaptic(); setHubOpen(true); }}
                    className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(217,70,239,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    title="Device haptics and configuration hub"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block">Settings</span>
                  </button>

                  {/* Keyboard Shortcuts button */}
                  <button
                    onClick={() => { triggerHaptic(); setShortcutsOpen(true); }}
                    className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(99,102,241,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    title="View Keyboard Hotkeys helper"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider hidden md:inline-block font-sans">Hotkeys</span>
                  </button>

                  {/* Theme Switcher trigger */}
                  <button
                    onClick={() => { triggerHaptic(); handleToggleTheme(); }}
                    className="p-2 rounded bg-[#10121d] hover:bg-[#151929] border border-[#1f243a] hover:border-sky-500/50 text-slate-400 hover:text-sky-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                    title="Toggle screen light/dark visual theme"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  </button>

                  {/* Collapsible conversion history slide-out shortcut */}
                  <button
                    onClick={() => { triggerHaptic(); setHistoryOpen(!historyOpen); }}
                    className={`p-2 rounded border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                      historyOpen 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                        : 'bg-[#10121d] hover:bg-[#151929] border-[#1f243a] hover:border-indigo-500/50 text-slate-400 hover:text-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.25)]'
                    }`}
                    title="Toggle historic conversions log panel"
                  >
                    <History className="w-3.5 h-3.5" />
                    {history.length > 0 && (
                      <span className="bg-fuchsia-500 text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full font-black">
                        {history.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Reading Progress Slider Bar */}
              <div className="w-full h-[2.5px] bg-slate-950 absolute bottom-0 left-0 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-550 to-indigo-500 transition-all duration-150"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </header>

            {/* Dynamic Body Content & Sliders */}
            <div className="flex-1 flex relative overflow-hidden">
              <main
                id="main-scroll-container"
                className="flex-1 p-3 sm:p-6 md:p-8 space-y-12 max-w-7xl mx-auto w-full overflow-y-auto flex flex-col justify-between"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedView}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 240,
                      damping: 24,
                    }}
                    className="space-y-6 w-full flex-1"
                  >
                    {renderActiveView()}
                  </motion.div>
                </AnimatePresence>

              {/* Right Slides panel for history items list */}
              {historyOpen && (
                <aside className="w-[300px] border-l border-slate-705 border-slate-700 bg-slate-900 absolute lg:static top-0 right-0 h-full z-40 transition shadow-2xl flex flex-col">
                  <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/40">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Conversion History</span>
                    <button
                      onClick={() => setHistoryOpen(false)}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 bg-slate-900/60">
                    <HistoryView
                      history={history}
                      onClearHistory={handleClearHistory}
                      onRemoveRecord={handleRemoveRecord}
                      onSelectRecord={handleSelectRecord}
                    />
                  </div>
                </aside>
              )}
        {/* High Density Advanced Footer with newsletters, stats, columns and connects */}
        <footer className="bg-[#0b0d12]/60 border-t border-[#1a1e2a] text-slate-400 text-xs mt-12 pt-12 pb-8 px-4 sm:px-6 rounded-xl w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {/* Column 1: Branding & Bullet Stats */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-tr from-fuchsia-500 to-indigo-500 rounded flex items-center justify-center font-bold text-white text-[11px] shadow-[0_0_8px_rgba(217,70,239,0.4)]">
                  RL
                </div>
                <span className="font-extrabold text-slate-100 tracking-wider text-sm uppercase font-mono">
                  Radix<span className="text-fuchsia-500 font-black">Lab</span>
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
                A comprehensive engineering tool for multi-base number system conversions, digital logic processing, binary visualized learning, and cryptographic hash computations.
              </p>
              
              {/* Bullet Stats block */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-[#12141c]/80 border border-[#1d2130] rounded p-2 text-center">
                  <div className="text-fuchsia-400 font-mono font-bold text-xs uppercase">50+</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-tighter">CS Functions</div>
                </div>
                <div className="bg-[#12141c]/80 border border-[#1d2130] rounded p-2 text-center">
                  <div className="text-indigo-400 font-mono font-bold text-xs uppercase">15+</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-tighter">Bases Active</div>
                </div>
                <div className="bg-[#12141c]/80 border border-[#1d2130] rounded p-2 text-center">
                  <div className="text-emerald-400 font-mono font-bold text-xs uppercase">100%</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-tighter">Ad Free</div>
                </div>
              </div>
            </div>

            {/* Column 2: Interactive Features */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block">Features</span>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => { triggerHaptic(); setSelectedView('converter'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Multi base conversion</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('scientific'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Scientific calculator</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('learn'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Visual learning tools</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('ieee754'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">IEEE 754 analyzer</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('color'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Color converter</button></li>
              </ul>
            </div>

            {/* Column 3: Developer Tools */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block">Developer Tools</span>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => { triggerHaptic(); setSelectedView('hash'); }} className="hover:text-indigo-400 transition cursor-pointer text-left">Hash generators</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('base64'); }} className="hover:text-indigo-400 transition cursor-pointer text-left">Base64 encoder</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('uuid'); }} className="hover:text-indigo-400 transition cursor-pointer text-left">UUID generator</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('regex'); }} className="hover:text-indigo-400 transition cursor-pointer text-left">Regex tester</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('bitpatterns'); }} className="hover:text-indigo-400 transition cursor-pointer text-left">Bit patterns</button></li>
                <li><button onClick={() => { triggerHaptic(); setSelectedView('signed'); }} className="hover:text-indigo-400 transition cursor-pointer text-left">Two's complement</button></li>
              </ul>
            </div>

            {/* Column 4: Links / Resources */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block">Resources</span>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => { triggerHaptic(); setShortcutsOpen(true); }} className="hover:text-slate-250 hover:text-slate-200 transition cursor-pointer text-left">Keyboard Shortcuts</button></li>
                <li><button onClick={() => { triggerHaptic(); showToast("Advanced Number Converter version 2.1.0 Stable. Engineered with maximum precision."); }} className="hover:text-slate-200 transition cursor-pointer text-left">About the Engine</button></li>
                <li><button onClick={() => { triggerHaptic(); showToast("Your conversions and settings are completely auto-saved locally. No cookies are tracked."); }} className="hover:text-slate-200 transition cursor-pointer text-left">Privacy Policy</button></li>
                <li><button onClick={() => { triggerHaptic(); showToast("Feedback logged! Thank you for supporting the lab."); }} className="hover:text-slate-200 transition cursor-pointer text-left">Send Feedback</button></li>
                <li><button onClick={() => { triggerHaptic(); showToast("Changelog v2.1.0: Added smart voice input parsing, customizable haptic vibration feedback, auto save state, index.css styled scrollbars."); }} className="hover:text-slate-200 transition cursor-pointer text-left">Changelog v2.1</button></li>
              </ul>
            </div>

            {/* Column 5: Connect Socials & Newsletter */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block font-mono">Connect</span>
              
              {/* Social icons row */}
              <div className="flex items-center gap-2 pt-1">
                <a href="#github" onClick={(e) => { e.preventDefault(); triggerHaptic(); showToast("Redirecting to GitHub Repository..."); }} className="w-8 h-8 rounded bg-[#131722]/80 border border-[#1f2436] hover:border-fuchsia-500 flex items-center justify-center text-slate-400 hover:text-fuchsia-400 transition">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#twitter" onClick={(e) => { e.preventDefault(); triggerHaptic(); showToast("Redirecting to Twitter..."); }} className="w-8 h-8 rounded bg-[#131722]/80 border border-[#1f2436] hover:border-fuchsia-500 flex items-center justify-center text-slate-400 hover:text-fuchsia-400 transition">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#linkedin" onClick={(e) => { e.preventDefault(); triggerHaptic(); showToast("Redirecting to LinkedIn..."); }} className="w-8 h-8 rounded bg-[#131722]/80 border border-[#1f2436] hover:border-fuchsia-500 flex items-center justify-center text-slate-400 hover:text-fuchsia-400 transition">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#discord" onClick={(e) => { e.preventDefault(); triggerHaptic(); showToast("Opening Discord Lab Server invitation..."); }} className="w-8 h-8 rounded bg-[#131722]/80 border border-[#1f2436] hover:border-fuchsia-500 flex items-center justify-center text-slate-400 hover:text-fuchsia-400 transition">
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>

              {/* Newsletter subscription form */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Newsletter subscription</span>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newsletterEmail.trim()) return;
                    triggerSuccessBeep();
                    showToast(`Subscribed successfully with: ${newsletterEmail}`);
                    setNewsletterEmail('');
                  }}
                  className="flex items-center bg-[#131722]/80 border border-[#1f2436] rounded px-2 py-1.5 focus-within:border-fuchsia-500 transition"
                >
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-transparent text-[10px] text-slate-100 placeholder:text-slate-600 outline-none w-full"
                  />
                  <button type="submit" className="text-slate-400 hover:text-fuchsia-400 transition pr-1 cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1a1e2a] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
            {/* Left: copyright note with design link */}
            <div>
              © 2026 RadixLab Converter Suite. Made with ❤️ by{' '}
              <a 
                href="#kiran" 
                onClick={(e) => { e.preventDefault(); triggerSuccessBeep(); showToast("Kiran Shams, Lead Engineer."); }} 
                className="text-fuchsia-400 hover:text-fuchsia-300 transition underline font-bold"
              >
                Kiran Shams
              </a>.
            </div>

            {/* Middle: Standard Quick terms & cookies */}
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => { e.preventDefault(); triggerHaptic(); setLegalTab('terms'); setLegalOpen(true); }} 
                className="hover:text-fuchsia-400 text-slate-500 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer text-[10px] font-mono outline-none"
              >
                Terms
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); triggerHaptic(); setLegalTab('privacy'); setLegalOpen(true); }} 
                className="hover:text-fuchsia-400 text-slate-500 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer text-[10px] font-mono outline-none"
              >
                Privacy
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); triggerHaptic(); setLegalTab('cookies'); setLegalOpen(true); }} 
                className="hover:text-fuchsia-400 text-slate-500 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer text-[10px] font-mono outline-none"
              >
                Cookies
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); triggerHaptic(); setLegalTab('license'); setLegalOpen(true); }} 
                className="hover:text-fuchsia-400 text-slate-500 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer text-[10px] font-mono outline-none"
              >
                License
              </button>
            </div>

            {/* Right: Build indicator details */}
            <div className="flex items-center gap-1.5 uppercase font-bold text-slate-600 tracking-wide bg-[#0c0d15] px-2.5 py-1 rounded border border-[#1a1c29]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Version 2.1.0 Build 2026.06</span>
            </div>
          </div>
        </footer>
              </main>
            </div>
          </div>
        </div>

        {/* Transient Custom Toast Overlay Alert Box */}
        {toast && (
          <div className="fixed bottom-24 right-6 z-50 bg-[#12141c] border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-slate-100 rounded-lg p-3.5 flex items-center gap-3.5 max-w-sm text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4.5 h-4.5 text-fuchsia-400 flex-shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Global Control Hub Modal Cabinet Drawer */}
        {hubOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className={`max-w-xl w-full p-6 border rounded-lg shadow-2xl overflow-y-auto max-h-[90vh] ${
              theme === 'dark' ? 'bg-[#10121a]/95 border-[#282d3e] text-slate-200' : 'bg-white border-slate-205 text-slate-700'
            }`}>
              <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-[#282d3e]">
                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-fuchsia-400 font-mono">
                  <Settings className="w-4.5 h-4.5 text-fuchsia-400" />
                  Control Hub & Auto Saved Settings
                </span>
                <button
                  onClick={() => { triggerHaptic(); setHubOpen(false); }}
                  className="p-1.5 bg-[#171a25] hover:bg-[#202534] rounded text-slate-400 cursor-pointer transition"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Desk 1: Tactile Feedback Auto-Saving Settings */}
                <div className="space-y-3 bg-[#131621] p-4 rounded-lg border border-[#212638]">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-fuchsia-400" />
                    Haptic & Audio Configurations (Auto Saving)
                  </h3>
                  
                  <div className="space-y-2.5 text-xs">
                    {/* Haptic Vibrate Setting */}
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <div className="font-semibold text-slate-300">Device Haptic Vibration</div>
                        <div className="text-[10px] text-slate-500">Enable physical mobile touch triggers</div>
                      </div>
                      <button 
                        onClick={() => updateSetting('hapticsEnabled', !settings.hapticsEnabled)}
                        className={`w-11 h-6 rounded-full transition flex items-center p-1 cursor-pointer ${settings.hapticsEnabled ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${settings.hapticsEnabled ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>

                    {/* Sound clicks Tick Setting */}
                    <div className="flex justify-between items-center py-1 border-t border-[#202535] pt-2">
                      <div>
                        <div className="font-semibold text-slate-300">Tactile Audio Ticks</div>
                        <div className="text-[10px] text-slate-500">Play mechanical sound synthesized waves on tap</div>
                      </div>
                      <button 
                        onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                        className={`w-11 h-6 rounded-full transition flex items-center p-1 cursor-pointer ${settings.soundEnabled ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${settings.soundEnabled ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>

                    {/* Auto copy on action Setting */}
                    <div className="flex justify-between items-center py-1 border-t border-[#202535] pt-2">
                      <div>
                        <div className="font-semibold text-slate-300">Auto-Copy Calculations</div>
                        <div className="text-[10px] text-slate-500">Automatically copy converter output results</div>
                      </div>
                      <button 
                        onClick={() => updateSetting('autoCopy', !settings.autoCopy)}
                        className={`w-11 h-6 rounded-full transition flex items-center p-1 cursor-pointer ${settings.autoCopy ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${settings.autoCopy ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desk 2: Favorite System Manager */}
                <div className="space-y-3 bg-[#131621] p-4 rounded-lg border border-[#212638]">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Bookmarked Favorites ({favorites.length})
                  </h3>

                  {favorites.length === 0 ? (
                    <div className="text-[11px] text-slate-500 italic py-2 text-center">
                      No bookmarks saved yet! Hit the star icon Star (☆) next to any calculation result to favorite it.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {favorites.map((fav) => (
                        <div 
                          key={fav.id}
                          className="flex items-center justify-between bg-[#1a1d29] border border-[#282d3e] rounded p-2 text-xs"
                        >
                          <button
                            onClick={() => handleSelectFavorite(fav)}
                            className="flex-1 text-left font-mono text-[10px] text-fuchsia-350 hover:text-fuchsia-300 font-bold hover:underline transition cursor-pointer"
                          >
                            {fav.title}
                          </button>
                          <button
                            onClick={() => handleDeleteFavorite(fav.id)}
                            className="p-1 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded transition cursor-pointer"
                            title="Remove favorite bookmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desk 3: Speech Input commands helper Guide */}
                <div className="space-y-3 bg-[#131621] p-4 rounded-lg border border-[#212638]">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-indigo-400" />
                    Voice Commands Dictation Guide (Web Speech API)
                  </h3>
                  <div className="text-[10px] text-slate-400 leading-relaxed space-y-1 font-sans">
                    <p>Click the microphone button 🎙️ next to any active text input, speak clearly, and the engine will translate words to values automatically:</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500">
                      <li>For <b className="text-fuchsia-400">Decimal (Base 10)</b> conversions: Speak natural oral values e.g. <span className="font-mono bg-[#1a1d29] px-1 rounded text-fuchsia-300">"two hundred forty five"</span> ➔ <span className="font-mono text-emerald-400 font-bold">245</span></li>
                      <li>For <b className="text-indigo-400">Binary (Base 2)</b> inputs: Speak numeral sequences e.g. <span className="font-mono bg-[#1a1d29] px-1 rounded text-indigo-300">"one zero one one zero"</span> ➔ <span className="font-mono text-emerald-400 font-bold">10110</span></li>
                      <li>For <b className="text-amber-500">Hexadecimal (Base 16)</b>: Use standard letters, or phonetic equivalents e.g. <span className="font-mono bg-[#1a1d29] px-1 rounded text-amber-300">"alpha foxtrot zero five"</span> ➔ <span className="font-mono text-emerald-400 font-bold">AF05</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { triggerHaptic(); setHubOpen(false); }}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition duration-150 cursor-pointer text-center shadow"
              >
                Return to lab
              </button>
            </div>
          </div>
        )}

        {/* Shortcuts Helper Modal Box */}
        {shortcutsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className={`max-w-md w-full p-6 border rounded-lg shadow-xl ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-205 text-slate-700'
            }`}>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
                  <Keyboard className="w-4 h-4" />
                  CS & DLD Keyboard Shortcuts
                </span>
                <button
                  onClick={() => { triggerHaptic(); setShortcutsOpen(false); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-850 rounded text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Base Converter</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + 1</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Base Calculator</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + 2</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Scientific Calculator</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + 3</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Batch Convert</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + 4</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Quiz & Practice</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + 5</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-855">
                  <span className="text-slate-400">IEEE 754 Float</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + F</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Two's Complement</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + T</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Bit Patterns</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + B</kbd>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">Cryptographic Hash</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + H</kbd>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-indigo-950/40 bg-indigo-950/20 px-2 rounded">
                  <span className="text-indigo-300 font-bold">Fast Section Cycle</span>
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-indigo-900/60 border border-indigo-700 rounded text-[9px] font-bold text-fuchsia-300">↑ Up</kbd>
                    <kbd className="px-1.5 py-0.5 bg-indigo-900/60 border border-indigo-700 rounded text-[9px] font-bold text-fuchsia-300">↓ Down</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Shortcuts List</span>
                  <kbd className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">Alt + K</kbd>
                </div>
              </div>

              <button
                onClick={() => { triggerHaptic(); setShortcutsOpen(false); }}
                className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition duration-150 cursor-pointer text-center"
              >
                Close Helper Panel
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Voice Dictation Terminal Modal */}
        {voiceAssistantOpen && (
          <VoiceDictationModal
            theme={theme}
            onClose={() => { triggerHaptic(); setVoiceAssistantOpen(false); }}
            onDeploy={(parsedVal, base) => {
              triggerHaptic();
              setSelectedView('converter');
              setActiveConverterRecord({
                input: parsedVal,
                fromBase: base,
                toBase: base === 2 ? 10 : 2
              });
              setVoiceAssistantOpen(false);
              triggerSuccessBeep();
              showToast(`Exported verbal code "${parsedVal}" in Base-${base} successfully!`);
            }}
          />
        )}

        {/* Floating Fixed Bottom Glass Navigation Dock (Exclusively visible on Mobile/Tablet viewports) */}
        <AnimatePresence>
          <motion.div
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 100, x: '-50%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="lg:hidden fixed bottom-6 left-1/2 z-40 bg-[#070a12]/90 backdrop-blur-2xl border border-[#232943] rounded-2xl px-4 py-2.5 flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-fuchsia-500/30 transition-all duration-300 max-w-[95vw] w-max"
          >
            {/* Audio dictation helper */}
            <motion.button
              onClick={() => { triggerHaptic(); setVoiceAssistantOpen(true); }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 hover:from-purple-950/50 hover:to-indigo-950/50 border border-[#222741] hover:border-fuchsia-500/60 text-slate-400 hover:text-fuchsia-400 transition-colors duration-200 cursor-pointer relative group flex items-center justify-center"
              title="Open Dictation Helper"
            >
              <Mic className="w-4.5 h-4.5" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-[#0f111d] border border-[#232841] text-[9px] font-black text-slate-200 uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl">
                Speak
              </span>
            </motion.button>

            {/* Favorites list */}
            <motion.button
              onClick={() => { triggerHaptic(); setHubOpen(true); }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 hover:from-purple-950/50 hover:to-indigo-950/50 border border-[#222741] hover:border-amber-500/60 text-slate-400 hover:text-amber-400 transition-colors duration-200 cursor-pointer relative group flex items-center justify-center"
              title="Open Saved Bookmarks"
            >
              <Star className="w-4.5 h-4.5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse">
                  {favorites.length}
                </span>
              )}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-[#0f111d] border border-[#232841] text-[9px] font-black text-slate-200 uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl">
                Bookmarks
              </span>
            </motion.button>

            {/* Settings */}
            <motion.button
              onClick={() => { triggerHaptic(); setHubOpen(true); }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 hover:from-purple-950/50 hover:to-indigo-950/50 border border-[#222741] hover:border-indigo-500/60 text-slate-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer relative group flex items-center justify-center"
              title="Open Settings Console"
            >
              <Settings className="w-4.5 h-4.5" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-[#0f111d] border border-[#232841] text-[9px] font-black text-slate-200 uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl">
                Settings
              </span>
            </motion.button>

            {/* Shortcuts Helper */}
            <motion.button
              onClick={() => { triggerHaptic(); setShortcutsOpen(true); }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 hover:from-purple-950/50 hover:to-indigo-950/50 border border-[#222741] hover:border-violet-500/60 text-slate-400 hover:text-violet-400 transition-colors duration-200 cursor-pointer relative group flex items-center justify-center"
              title="Shortcuts Guide"
            >
              <Keyboard className="w-4.5 h-4.5" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-[#0f111d] border border-[#232841] text-[9px] font-black text-slate-200 uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl">
                Hotkeys
              </span>
            </motion.button>

            {/* Light/Dark Mode Switcher */}
            <motion.button
              onClick={() => { triggerHaptic(); handleToggleTheme(); }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 hover:from-purple-950/50 hover:to-indigo-950/50 border border-[#222741] hover:border-sky-500/60 text-slate-400 hover:text-sky-400 transition-colors duration-200 cursor-pointer relative group flex items-center justify-center"
              title="Toggle Theme style"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-[#0f111d] border border-[#232841] text-[9px] font-black text-slate-200 uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl">
                Theme
              </span>
            </motion.button>

            {/* Collapsible History Log panel */}
            <motion.button
              onClick={() => { triggerHaptic(); setHistoryOpen(!historyOpen); }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-xl border transition-colors duration-200 cursor-pointer relative group flex items-center justify-center ${
                historyOpen 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                  : 'bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 hover:from-purple-950/50 hover:to-indigo-950/50 border-[#222741] hover:border-indigo-500/60 text-slate-400 hover:text-indigo-400'
              }`}
              title="Conversion Log Panel"
            >
              <History className="w-4.5 h-4.5" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {history.length}
                </span>
              )}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-[#0f111d] border border-[#232841] text-[9px] font-black text-slate-200 uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-150 whitespace-nowrap pointer-events-none shadow-xl">
                History
              </span>
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Legal & Privacy Modal */}
        <LegalModal
          theme={theme}
          isOpen={legalOpen}
          initialTab={legalTab}
          onClose={() => { triggerHaptic(); setLegalOpen(false); }}
        />

        {/* Sidebar Mobile Navigation drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-sm">
            <div className={`w-[260px] h-full flex flex-col p-4 shadow-xl overflow-y-auto ${
              theme === 'dark' ? 'bg-[#0f111a] text-slate-200' : 'bg-white text-slate-700'
            }`}>
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="font-bold text-slate-100 text-sm">Navigation Menu</span>
                <button
                  onClick={() => { triggerHaptic(); setSidebarOpen(false); }}
                  className="p-1 rounded bg-slate-950 hover:bg-slate-850 text-slate-350 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {MENU_GROUPS.map((group) => (
                  <div key={group.section} className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block px-4 mb-2">
                      {group.section}
                    </span>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = selectedView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            triggerHaptic();
                            setSelectedView(item.id);
                            setActiveConverterRecord(null);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer justify-start text-left relative overflow-hidden ${
                            isActive
                              ? theme === 'dark'
                                ? 'bg-gradient-to-r from-purple-950/40 to-indigo-950/20 text-fuchsia-350 font-bold'
                                : 'bg-indigo-50 text-indigo-600 font-bold'
                              : theme === 'dark'
                              ? 'text-slate-400 hover:bg-slate-800'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isActive && theme === 'dark' && (
                            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-fuchsia-500 to-indigo-500" />
                          )}
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => { triggerHaptic(); setSidebarOpen(false); }} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
