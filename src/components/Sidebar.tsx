import React, { useRef, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  Layers, 
  GraduationCap, 
  Cpu, 
  ToggleLeft, 
  Binary, 
  Palette, 
  ShieldCheck, 
  Code, 
  Key, 
  Sliders, 
  GitCommit, 
  Database,
  BarChart3
} from 'lucide-react';
import { SelectedView } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface MenuItem {
  id: SelectedView;
  label: string;
  icon: any;
  color: string;
}

interface MenuGroup {
  section: string;
  items: MenuItem[];
}

export const MENU_GROUPS: MenuGroup[] = [
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
      { id: 'ieee754', label: 'IEEE 754 Float', icon: Cpu, color: 'text-indigo-400' },
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

interface SidebarProps {
  selectedView: SelectedView;
  setSelectedView: (view: SelectedView) => void;
  setActiveConverterRecord: (record: any) => void;
  theme: 'dark' | 'light';
  onItemClick?: () => void; // Optional callback for mobile closing behavior
}

export default function Sidebar({
  selectedView,
  setSelectedView,
  setActiveConverterRecord,
  theme,
  onItemClick,
}: SidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const flattenedItems = useMemo(() => MENU_GROUPS.flatMap((g) => g.items), []);

  // Keyboard navigation within focused sidebar list (roving-tabindex variant)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();

    const buttons = Array.from(navRef.current?.querySelectorAll('button') ?? []);
    const activeEl = document.activeElement as HTMLButtonElement | null;
    const activeIndex = activeEl ? buttons.indexOf(activeEl) : -1;

    if (activeIndex === -1) return;

    const delta = e.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (activeIndex + delta + buttons.length) % buttons.length;
    const nextBtn = buttons[nextIndex] as HTMLButtonElement;

    nextBtn.focus();
    
    // Find matching view from the button ID attribute or custom attribute
    const viewId = nextBtn.getAttribute('data-view-id') as SelectedView;
    if (viewId) {
      triggerHaptic();
      setSelectedView(viewId);
      setActiveConverterRecord(null);
    }
  };

  // Sync focus to selected item on manual clicks
  useEffect(() => {
    const activeEl = navRef.current?.querySelector(`[data-view-id="${selectedView}"]`) as HTMLButtonElement;
    if (activeEl && document.activeElement && navRef.current?.contains(document.activeElement)) {
      activeEl.focus();
    }
  }, [selectedView]);

  return (
    <aside
      className={`w-[260px] border-r flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 z-20 ${
        theme === 'dark' 
          ? 'bg-[#060813]/85 backdrop-blur-xl border-[#151b2d]' 
          : 'bg-white/95 backdrop-blur-xl border-slate-200'
      }`}
    >
      {/* Brand Header */}
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

      {/* Accessible Navigation Container */}
      <nav
        ref={navRef}
        onKeyDown={handleKeyDown}
        aria-label="Sidebar main tools navigation menu"
        className="p-4 flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] select-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-800"
      >
        {MENU_GROUPS.map((group) => (
          <div key={group.section} className="space-y-1" role="group" aria-labelledby={`group-${group.section}`}>
            <span
              id={`group-${group.section}`}
              className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block px-4 mb-2 select-none"
            >
              {group.section}
            </span>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = selectedView === item.id;
              return (
                <button
                  key={item.id}
                  data-view-id={item.id}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedView(item.id);
                    setActiveConverterRecord(null);
                    if (onItemClick) onItemClick();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={isActive ? 0 : -1} // Roving Tabindex setup for high accessibility
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer justify-start text-left relative overflow-hidden outline-none duration-150 focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 ${
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
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-fuchsia-400 scale-110' : 'text-slate-400 group-hover:scale-105'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer metadata bar */}
      <div className="p-4 border-t border-[#1d2130] text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5 bg-[#060813]/60">
        <span>DLD LAB STATION V2.1</span>
      </div>
    </aside>
  );
}
