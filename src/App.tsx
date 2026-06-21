import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { SelectedView, ConversionRecord } from './types';
import ErrorBoundary from './components/ErrorBoundary';

// Helper custom components
import Sidebar, { MENU_GROUPS } from './components/Sidebar';
import Header from './components/Header';
import ControlHubModal from './components/ControlHubModal';
import ShortcutsModal from './components/ShortcutsModal';
import VoiceDictationModal from './components/VoiceDictationModal';
import LegalModal from './components/LegalModal';

import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Github, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { triggerHaptic, triggerSuccessBeep } from './utils/haptics';

// React.lazy + Suspense for high performance code-splitting per tool module
const ConverterView = lazy(() => import('./components/ConverterView'));
const CalculatorView = lazy(() => import('./components/CalculatorView'));
const SignedComplementView = lazy(() => import('./components/SignedComplementView'));
const IEEE754View = lazy(() => import('./components/IEEE754View'));
const EducationalView = lazy(() => import('./components/EducationalView'));
const HistoryView = lazy(() => import('./components/HistoryView'));
const ScientificCalculatorView = lazy(() => import('./components/ScientificCalculatorView'));
const BatchConvertView = lazy(() => import('./components/BatchConvertView'));
const AsciiUnicodeView = lazy(() => import('./components/AsciiUnicodeView'));
const ColorConverterView = lazy(() => import('./components/ColorConverterView'));
const HashGeneratorView = lazy(() => import('./components/HashGeneratorView'));
const Base64View = lazy(() => import('./components/Base64View'));
const UuidGeneratorView = lazy(() => import('./components/UuidGeneratorView'));
const RegexTesterView = lazy(() => import('./components/RegexTesterView'));
const BitPatternsView = lazy(() => import('./components/BitPatternsView'));
const NumberLineView = lazy(() => import('./components/NumberLineView'));
const BinaryTreeView = lazy(() => import('./components/BinaryTreeView'));
const BytesBitsView = lazy(() => import('./components/BytesBitsView'));
const AnalyticsView = lazy(() => import('./components/AnalyticsView'));

// An dynamic elegant suspense skeleton loader matched perfectly with the branding theme
const DynamicSkeletonLoader = () => (
  <div className="w-full flex-1 min-h-[350px] p-6 rounded-2xl bg-[#0a0c16]/50 border border-indigo-950/20 backdrop-blur-md flex flex-col justify-center items-center gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-fuchsia-500 animate-spin" />
    <span className="text-xs font-mono font-bold tracking-widest text-[#5f6890] uppercase">
      RadixLab Loading...
    </span>
  </div>
);

export default function App() {
  const [selectedView, setSelectedView] = useState<SelectedView>('converter');
  const [history, setHistory] = useState<ConversionRecord[]>([]);

  // Load history from state context into active converter view
  const [activeConverterRecord, setActiveConverterRecord] = useState<{
    input: string;
    fromBase: number;
    toBase: number;
  } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'cookies' | 'license'>('terms');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [readingProgress, setReadingProgress] = useState(0);

  // Auto-Save settings & favorites states
  const [hubOpen, setHubOpen] = useState(false);
  const [hubTab, setHubTab] = useState<'settings' | 'bookmarks'>('settings'); // Premium UX feature split 
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
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

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favorites-updated', loadFavorites);
    return () => window.removeEventListener('favorites-updated', loadFavorites);
  }, []);

  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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

  // Handle global keyboard shortcuts listeners (ARROW KEYS REMOVED AS REQUESTED)
  useEffect(() => {
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

      if (e.altKey) {
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

  // Memoize active view rendering
  const activeViewElement = useMemo(() => {
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
  }, [selectedView, activeConverterRecord, history]);

  return (
    <ErrorBoundary theme={theme}>
      <div className={`h-screen w-screen overflow-hidden font-sans antialiased flex flex-col relative transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#04060c]' : 'bg-slate-50 text-slate-705'
      }`}>
        {/* Ambient background decoration */}
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

        {/* Root Structural Scaffold */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative z-10">
          <Sidebar
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            setActiveConverterRecord={setActiveConverterRecord}
            theme={theme}
          />

          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <Header
              selectedView={selectedView}
              theme={theme}
              handleToggleTheme={handleToggleTheme}
              setSidebarOpen={setSidebarOpen}
              setVoiceAssistantOpen={setVoiceAssistantOpen}
              setHubOpen={setHubOpen}
              setHubTab={setHubTab}
              favoritesCount={favorites.length}
              historyCount={history.length}
              historyOpen={historyOpen}
              setHistoryOpen={setHistoryOpen}
              setShortcutsOpen={setShortcutsOpen}
              readingProgress={readingProgress}
            />

            {/* Layout container - SCROLL CONTAINER SEGREGATED PERFECTLY TO SOLVE SCROLLBAR INSETS */}
            <div className="flex-1 flex relative overflow-hidden">
              <main
                id="main-scroll-container"
                className="flex-1 w-full overflow-y-auto"
              >
                {/* Content layer inside scrollbar viewport */}
                <div className="p-3 sm:p-6 md:p-8 space-y-12 max-w-7xl mx-auto w-full flex flex-col justify-between min-h-full">
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
                      <Suspense fallback={<DynamicSkeletonLoader />}>
                        {activeViewElement}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>

                  {/* High Density Advanced Footer */}
                  <footer className="bg-[#0b0d12]/60 border border-[#1a1e2a]/80 text-slate-400 text-xs mt-12 pt-12 pb-8 px-4 sm:px-6 rounded-2xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
                      {/* Column 1: Branding & Stats */}
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

                      {/* Column 2: Main Features */}
                      <div className="md:col-span-2 space-y-3">
                        <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block">Features</span>
                        <ul className="space-y-2 text-[11px]">
                          <li><button onClick={() => { triggerHaptic(); setSelectedView('converter'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Multi base conversion</button></li>
                          <li><button onClick={() => { triggerHaptic(); setSelectedView('scientific'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Scientific calculator</button></li>
                          <li><button onClick={() => { triggerHaptic(); setSelectedView('learn'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">Quiz & practice</button></li>
                          <li><button onClick={() => { triggerHaptic(); setSelectedView('ieee754'); }} className="hover:text-fuchsia-400 transition cursor-pointer text-left">IEEE 754 visualizer</button></li>
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

                      {/* Column 4: Resources */}
                      <div className="md:col-span-2 space-y-3">
                        <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block">Resources</span>
                        <ul className="space-y-2 text-[11px]">
                          <li><button onClick={() => { triggerHaptic(); setShortcutsOpen(true); }} className="hover:text-slate-200 transition cursor-pointer text-left">Keyboard Shortcuts</button></li>
                          <li><button onClick={() => { triggerHaptic(); showToast("Advanced Number Converter version 2.1.0 Stable. Engineered with maximum precision."); }} className="hover:text-slate-200 transition cursor-pointer text-left">About the Engine</button></li>
                          <li><button onClick={() => { triggerHaptic(); setLegalTab('privacy'); setLegalOpen(true); }} className="hover:text-slate-200 transition cursor-pointer text-left">Privacy Policy</button></li>
                          <li><button onClick={() => { triggerHaptic(); showToast("Feedback logged! Thank you for supporting the lab."); }} className="hover:text-slate-200 transition cursor-pointer text-left">Send Feedback</button></li>
                          <li><button onClick={() => { triggerHaptic(); showToast("Changelog v2.1.0: Added smart voice input parsing, customizable haptic vibration feedback, auto save state, index.css styled scrollbars."); }} className="hover:text-slate-200 transition cursor-pointer text-left">Changelog v2.1</button></li>
                        </ul>
                      </div>

                      {/* Column 5: Social Connections */}
                      <div className="md:col-span-2 space-y-3 col-span-1 border-t md:border-t-0 border-[#1a1e28] pt-4 md:pt-0">
                        <span className="text-[10px] uppercase font-bold text-slate-200 tracking-widest block font-mono">Connect</span>
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

                        <div className="space-y-1.5 pt-2">
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Updates</span>
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
                              required
                              placeholder="Enter email" 
                              value={newsletterEmail}
                              onChange={(e) => setNewsletterEmail(e.target.value)}
                              className="bg-transparent text-slate-200 outline-none text-[10px] w-full"
                            />
                            <button type="submit" className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-wide cursor-pointer pl-1">Join</button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Footer agreement buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center border-t border-[#1a1e2a] pt-6 gap-4">
                      <div className="flex gap-4">
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

                      <div className="flex items-center gap-1.5 uppercase font-bold text-slate-600 tracking-wide bg-[#0c0d15] px-2.5 py-1 rounded border border-[#1a1c29]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        <span>Version 2.1.0 Build 2026.06</span>
                      </div>
                    </div>
                  </footer>
                </div>
              </main>

              {/* Right Slides panel for history items list */}
              {historyOpen && (
                <aside className="w-[300px] border-l border-slate-700 bg-slate-900 absolute lg:static top-0 right-0 h-full z-40 transition shadow-2xl flex flex-col">
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
                    <Suspense fallback={<DynamicSkeletonLoader />}>
                      <HistoryView
                        history={history}
                        onClearHistory={handleClearHistory}
                        onRemoveRecord={handleRemoveRecord}
                        onSelectRecord={handleSelectRecord}
                      />
                    </Suspense>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>

        {/* Custom Toast Alert Box */}
        {toast && (
          <div className="fixed bottom-24 right-6 z-50 bg-[#12141c] border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-slate-100 rounded-lg p-3.5 flex items-center gap-3.5 max-w-sm text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4.5 h-4.5 text-fuchsia-400 flex-shrink-0 animate-pulse" />
            <span>{toast}</span>
          </div>
        )}

        {/* Global Control Hub Modal Cabinet Drawer */}
        <ControlHubModal
          theme={theme}
          isOpen={hubOpen}
          onClose={() => setHubOpen(false)}
          activeTab={hubTab}
          setActiveTab={setHubTab}
          settings={settings}
          updateSetting={updateSetting}
          favorites={favorites}
          handleSelectFavorite={handleSelectFavorite}
          handleDeleteFavorite={handleDeleteFavorite}
        />

        {/* Shortcuts Helper Modal Box */}
        <ShortcutsModal
          theme={theme}
          isOpen={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
        />

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

        {/* Floating Fixed Bottom Glass Navigation Dock (Mobile/Tablet viewports) */}
        <AnimatePresence>
          {true && (
            <motion.div
              initial={{ y: 100, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: 100, x: '-50%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="lg:hidden fixed bottom-6 left-1/2 z-40 bg-[#070a12]/90 backdrop-blur-2xl border border-[#232943] rounded-2xl px-4 py-2.5 flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.7)] hover:border-fuchsia-500/30 transition-all duration-300 max-w-[95vw] w-max"
            >
              <button
                onClick={() => { triggerHaptic(); setVoiceAssistantOpen(true); }}
                className="p-2 text-slate-400 hover:text-fuchsia-400 transition cursor-pointer"
                title="Voice dictation helper"
              >
                Let's dictate
              </button>
            </motion.div>
          )}
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
          <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className={`w-[260px] h-full flex flex-col p-4 shadow-xl overflow-y-auto ${
              theme === 'dark' ? 'bg-[#0f111a] text-slate-200' : 'bg-white text-slate-700'
            }`}>
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="font-bold text-slate-105 font-mono text-sm uppercase">Suite Navigation</span>
                <button
                  onClick={() => { triggerHaptic(); setSidebarOpen(false); }}
                  className="p-1.5 rounded-lg bg-[#202534] text-slate-450 cursor-pointer hover:text-white transition"
                >
                  <X className="w-4.5 h-4.5" />
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
                                ? 'bg-gradient-to-r from-purple-950/40 to-indigo-950/20 text-fuchsia-350 font-bold border-l-4 border-fuchsia-500'
                                : 'bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold'
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
