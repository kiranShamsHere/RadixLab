import React, { useState } from 'react';
import { X, Shield, Scale, Info, FileText, Check, ShieldCheck, Cookie, Heart } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { motion } from 'motion/react';

interface LegalModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'cookies' | 'license';
}

export default function LegalModal({ theme, isOpen, onClose, initialTab = 'terms' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookies' | 'license'>(initialTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: FileText, desc: 'Rules & Usage of RadixLab converter suite' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, desc: 'Client-side processing & data control rules' },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie, desc: 'Active persistent key-value configuration flags' },
    { id: 'license', label: 'Suite License', icon: Scale, desc: 'Academic MIT guidelines & usage permissions' }
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.92, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`max-w-3xl w-full h-[85vh] rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 shadow-2xl relative ${
          theme === 'dark'
            ? 'bg-[#0f111a] border-[#252a3c] text-slate-200'
            : 'bg-white border-slate-250 text-slate-700'
        }`}
      >
        {/* Glow header bar accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 border-b border-[#202534] flex justify-between items-center bg-[#0d0f17]">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-purple-950/40 to-indigo-950/40 rounded-xl border border-purple-800/20 shadow-[inset_0_0_8px_rgba(168,85,247,0.1)]">
              <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-mono flex items-center gap-2">
                RadixLab <span className="text-fuchsia-500 font-extrabold">Agreement & Disclosures</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                Review the cryptographic mathematical suite terms, user choices, and license standards.
              </p>
            </div>
          </div>
          <button
            onClick={() => { triggerHaptic(); onClose(); }}
            className="p-2 bg-slate-900 border border-[#202534] hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg cursor-pointer transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dual Panel Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left panel: tabs selection menu */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#202534] p-4 bg-[#0a0c14] space-y-2 overflow-y-auto">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block px-2 mb-2 font-mono">
              Policy Sections
            </span>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { triggerHaptic(); setActiveTab(tab.id); }}
                  className={`w-full text-left p-2.5 rounded-lg border transition duration-200 cursor-pointer flex items-center gap-3 group relative ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border-[#4338ca] text-indigo-300'
                      : 'bg-transparent border-transparent hover:bg-[#121624] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-fuchsia-500 rounded-r" />
                  )}
                  <TabIcon className={`w-4 h-4 flex-shrink-0 ${activeTab === tab.id ? 'text-fuchsia-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <div>
                    <div className="font-bold text-[11px] leading-tight uppercase font-mono tracking-wider">
                      {tab.label}
                    </div>
                    <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5 group-hover:text-slate-400">
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#1e2335] text-[10px] text-slate-500 space-y-2.5 px-2">
              <div className="flex items-center gap-1.5 font-mono">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Effective June 20, 2026</span>
              </div>
              <p className="leading-relaxed font-sans">
                These rules apply to all dynamic arithmetic calculators, truth logs, and conversion visualization engines.
              </p>
            </div>
          </div>

          {/* Right panel: rich scrollable text content */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/30 space-y-6 font-sans text-xs text-slate-350 leading-relaxed">
            {activeTab === 'terms' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-fuchsia-400" />
                  1. Terms of Service & Mathematical Accuracy
                </h4>
                <p>
                  Welcome to <strong>RadixLab</strong>. By utilizing our multi-radix translation tools, digital arithmetic visualization models, and cryptographic hash utilities, you agree to comply with and be bound by the following terms of operation:
                </p>
                <div className="bg-[#0a0d15] p-4 rounded-lg border border-[#1f2436] space-y-2.5">
                  <div className="flex gap-2.5">
                    <span className="text-fuchsia-400 font-bold font-mono">1.1</span>
                    <p><strong>Educational Intent:</strong> RadixLab is designed primarily as a professional-grade educational workbench and developer diagnostic suite. It yields conversion solutions, dynamic proofs, binary tree charts, and IEEE-754 analyzes on a pure client-side sandbox.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-fuchsia-400 font-bold font-mono">1.2</span>
                    <p><strong>Mathematical Limits:</strong> All algorithms (floating-point IEEE analyzer, Gray code encoder, signed complement logic, division solvers) are evaluated strictly according to international mathematical structures. However, for critical cryptographic development or spaceflight calculations, developers must double-check boundaries.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="text-fuchsia-400 font-bold font-mono">1.3</span>
                    <p><strong>Prohibited Actions:</strong> Users are forbidden from executing denial of service commands or using simulated speech terminals for destructive purposes.</p>
                  </div>
                </div>
                <p>
                  For any query related to execution algorithms or step solvers, please consult the live mathematical explorer tabs.
                </p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-emerald-450 text-emerald-400" />
                  2. Privacy Policy & Client-Side Sandbox Security
                </h4>
                <p>
                  Your privacy is our core engineering value. RadixLab functions on a modern <strong>Zero-Transmission Protocol</strong> framework:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-[#0a0d15] p-3 rounded-lg border border-[#1f2436] space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase">🔒 NO SERVER DATA LOGGER</span>
                    <p className="text-[11px] text-slate-400">All conversion calculations are run direct inside your web browser. No numbers, keys, or hashes are ever transmitted off your device.</p>
                  </div>
                  <div className="bg-[#0a0d15] p-3 rounded-lg border border-[#1f2436] space-y-1">
                    <span className="text-[10px] font-bold text-fuchsia-400 font-mono uppercase">🎙️ SECURE VOICE DICTATION</span>
                    <p className="text-[11px] text-slate-400">Oral transcripts are parsed locally or using your system's built-in sandbox. We do not persist audio logs on remote cloud repositories.</p>
                  </div>
                </div>
                <p>
                  Because your data is calculated dynamically on-device, you retain absolute ownership and control over your converted outputs.
                </p>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Cookie className="w-4 h-4 text-amber-500" />
                  3. Cookie Policy & Local Key-Value Persistence
                </h4>
                <p>
                  RadixLab does not use tracking cookies, analytics tags, or intrusive corporate marketing loops. We only utilize standard client-side state mechanisms:
                </p>
                <table className="w-full text-left border-collapse border border-[#1f2436] font-mono text-[10px] bg-[#0c0e16] rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-900 border-b border-[#1f2436] text-slate-400">
                      <th className="p-2">Local Storage Key</th>
                      <th className="p-2">Purpose of Active Store</th>
                      <th className="p-2 text-fuchsia-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2436] text-slate-300">
                    <tr>
                      <td className="p-2"><code>adv_num_conv_history</code></td>
                      <td className="p-2">Caches your past calculation results for easy recall.</td>
                      <td className="p-2 text-amber-500">Persistent until manually deleted</td>
                    </tr>
                    <tr>
                      <td className="p-2"><code>adv_num_conv_favorites</code></td>
                      <td className="p-2">Stores frequently used bookmarks for rapid lookup.</td>
                      <td className="p-2 text-amber-500">Persistent until deleted</td>
                    </tr>
                    <tr>
                      <td className="p-2"><code>adv_num_conv_theme</code></td>
                      <td className="p-2">Saves dark/light state preference.</td>
                      <td className="p-2 text-amber-500">Persistent</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[11px] text-slate-450 italic">
                  Note: Clearing your standard web browser cache will safely restore RadixLab to its initial fresh state config.
                </p>
              </div>
            )}

            {activeTab === 'license' && (
              <div className="space-y-4 animate-fadeIn font-mono text-[11px]">
                <h4 className="font-bold text-xs text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  4. Academic MIT Open Source License
                </h4>
                <div className="bg-[#0a0d15] p-5 rounded-lg border border-[#1f2436] leading-relaxed text-slate-400">
                  <p className="text-white font-bold mb-3">Copyright © 2026 RadixLab Developer Team</p>
                  <p className="mb-3.5">
                    Permission is hereby granted, free of charge, to any person obtaining a copy of this mathematical conversion software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...
                  </p>
                  <p className="mb-3.5">
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Banner */}
        <div className="p-4 border-t border-[#202534] bg-[#0d0f17] flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Designed with absolute zero tracking.
          </span>
          <button
            onClick={() => { triggerHaptic(); onClose(); }}
            className="py-2 px-5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-650 hover:to-indigo-650 text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition shadow-[0_0_12px_rgba(109,40,217,0.3)]"
          >
            I Acknowledge & Accept
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
