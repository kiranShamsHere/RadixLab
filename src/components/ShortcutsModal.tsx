import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useModalClose } from '../hooks/useModalClose';
import { motion } from 'motion/react';

interface ShortcutsModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsModal({
  theme,
  isOpen,
  onClose,
}: ShortcutsModalProps) {
  const modalRef = useModalClose<HTMLDivElement>({
    isOpen,
    onClose,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    closeOnScroll: false,
    lockScroll: true,
    trapFocus: true,
  });

  if (!isOpen) return null;

  const shortcutKeys = [
    { label: 'Base Converter', key: 'Alt + 1' },
    { label: 'Base Calculator', key: 'Alt + 2' },
    { label: 'Scientific Calc', key: 'Alt + 3' },
    { label: 'Batch Convert', key: 'Alt + 4' },
    { label: 'Quiz & Practice', key: 'Alt + 5' },
    { label: 'IEEE 754 Float', key: 'Alt + F' },
    { label: "Two's Complement", key: 'Alt + T' },
    { label: 'Bit Patterns', key: 'Alt + B' },
    { label: 'Cryptographic Hash', key: 'Alt + H' },
    { label: 'Shortcuts Helper', key: 'Alt + K' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.92, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className={`max-w-md w-full p-6 border rounded-2xl shadow-2xl relative transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-[#0f111a]/95 border-[#282d3e] text-slate-200' 
            : 'bg-white border-slate-250 text-slate-700'
        }`}
      >
        {/* Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" />

        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-2.5 border-b border-[#282d3e]">
          <span className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5 text-indigo-400 font-mono">
            <Keyboard className="w-4.5 h-4.5" />
            Suite Keyboard Hotkeys
          </span>
          <button
            onClick={() => { triggerHaptic(); onClose(); }}
            className="p-1.5 bg-[#171a25]/60 hover:bg-[#202534]/85 border border-[#23293a] text-slate-400 hover:text-slate-100 rounded-lg cursor-pointer transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Shortcuts list details */}
        <div className="space-y-3 font-mono text-xs">
          {shortcutKeys.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 border-b border-[#1f2434]/50">
              <span className="text-slate-400 font-sans font-medium">{item.label}</span>
              <kbd className="px-2.5 py-1 bg-slate-950 border border-[#23293a] rounded-lg text-[10px] font-black text-indigo-400 shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)]">
                {item.key}
              </kbd>
            </div>
          ))}

          {/* Dynamic focused navigation notice */}
          <div className="flex justify-between items-center mt-4 py-2 px-3 border-t border-indigo-950/40 bg-indigo-950/20 rounded-xl border border-indigo-500/10">
            <div className="flex flex-col gap-0.5">
              <span className="text-indigo-300 font-bold font-sans text-xs">Fast Section Cycles</span>
              <span className="text-[10px] text-slate-500 font-sans">Available when sidebar selection has local focus</span>
            </div>
            <div className="flex gap-1.5">
              <kbd className="px-2 py-0.5 bg-indigo-900/60 border border-indigo-700/50 rounded-md text-[9px] font-black text-fuchsia-300">↑ Up</kbd>
              <kbd className="px-2 py-0.5 bg-indigo-900/60 border border-indigo-700/50 rounded-md text-[9px] font-black text-fuchsia-300">↓ Down</kbd>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => { triggerHaptic(); onClose(); }}
          className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer text-center"
        >
          Close Helper Panel
        </button>
      </motion.div>
    </motion.div>
  );
}
