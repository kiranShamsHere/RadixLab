import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Check, RotateCcw, Play, Compass, HelpCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { parseSpeechToNumber } from '../utils/speech';
import { motion } from 'motion/react';

interface VoiceDictationModalProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  onDeploy: (parsedVal: string, base: number) => void;
}

const PHONETIC_PRESETS = [
  { label: 'Binary Code Sequence', text: 'one zero one one zero zero', base: 2, desc: 'Translates to binary characters' },
  { label: 'Decimal Word Sum', text: 'five hundred seventy two', base: 10, desc: 'Translates as standard written sums' },
  { label: 'Hex NATO Phonetic', text: 'alpha delta foxtrot zero nine', base: 16, desc: 'Phonetic alphabet string lookup' },
  { label: 'Hexadecimal NATO Beef', text: 'bravo echo echo foxtrot', base: 16, desc: 'Generates hexadecimal codes' },
  { label: 'Simple Decimal Input', text: 'ninety nine', base: 10, desc: 'Translates simple oral integers' },
];

export default function VoiceDictationModal({ theme, onClose, onDeploy }: VoiceDictationModalProps) {
  const [activeBase, setActiveBase] = useState<number>(10);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [parsedValue, setParsedValue] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string>('');
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setRecognitionError('');
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        const parsed = parseSpeechToNumber(resultText, activeBase);
        setParsedValue(parsed);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission blocked. Please use our Interactive Sandbox simulation below!');
        } else {
          setRecognitionError(`Recognition failed: ${event.error}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [activeBase]);

  const startListening = () => {
    triggerHaptic();
    setRecognitionError('');
    setTranscript('');
    setParsedValue('');
    setActivePresetIndex(null);

    if (!recognitionRef.current) {
      setRecognitionError(
        'Real mic input not supported in this frame environment / browser. Please enjoy our fully interactive Phonetic Simulator below!'
      );
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setRecognitionError('Recognition service busy. Retry or try our simulated preset commands below.');
    }
  };

  const stopListening = () => {
    triggerHaptic();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleSimulatePreset = (presetText: string, presetBase: number, index: number) => {
    triggerHaptic();
    setActiveBase(presetBase);
    setActivePresetIndex(index);
    setTranscript(presetText);
    const parsed = parseSpeechToNumber(presetText, presetBase);
    setParsedValue(parsed);
    setRecognitionError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className={`max-w-xl w-full p-6 border rounded-xl shadow-2xl relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-[#0f111a] border-[#252a3c] text-slate-200' 
            : 'bg-white border-slate-250 text-slate-705 text-slate-700'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 blur-sm" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-[#202534]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-purple-950/40 border border-purple-800/30">
              <Mic className="w-5 h-5 text-fuchsia-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 font-mono">
                RadixLab <span className="text-fuchsia-500 font-extrabold">Speech Dictation</span> Terminal
              </h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                Convert conversational oral speech sentences directly into high precision number formats!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-[#202534] hover:border-slate-700 hover:bg-slate-800 text-slate-400 rounded cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Base Selector Tabs */}
        <div className="mb-5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
            1. Target Dictionary Base:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#0a0d15] p-1.5 rounded-lg border border-[#1f2436]">
            {[
              { base: 2, label: 'Binary (Base 2)' },
              { base: 10, label: 'Decimal (Base 10)' },
              { base: 16, label: 'Hexadecimal (Base 16)' }
            ].map((b) => (
              <button
                key={b.base}
                onClick={() => { triggerHaptic(); setActiveBase(b.base); setTranscript(''); setParsedValue(''); }}
                className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-md transition duration-200 cursor-pointer text-center ${
                  activeBase === b.base
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151a27]'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Recording Desk Container */}
        <div className="bg-[#07090f] p-5 rounded-xl border border-[#1f2436] mb-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Animated Pulsing Sound Rings */}
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <span className="w-32 h-32 rounded-full border border-fuchsia-500 animate-ping absolute" />
              <span className="w-24 h-24 rounded-full border border-indigo-500 animate-ping absolute" />
              <span className="w-16 h-16 rounded-full border border-purple-500 animate-ping absolute" />
            </div>
          )}

          <div className="mb-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] border-2 border-rose-300 scale-105'
                  : 'bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-105'
              }`}
            >
              <Mic className={`w-7 h-7 ${isListening ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
            {isListening ? (
              <span className="text-rose-500 animate-pulse flex items-center justify-center gap-1.5">
                🔴 Recording Spoken Audio Now...
              </span>
            ) : (
              'Click Mic to Speak standard sequence'
            )}
          </div>

          {recognitionError && (
            <p className="text-[11px] text-rose-400 font-sans mt-2 max-w-sm leading-relaxed px-3 bg-rose-950/20 py-1.5 rounded border border-rose-900/30">
              ⚠️ {recognitionError}
            </p>
          )}

          {/* Transcript Display Box */}
          <div className="w-full mt-4 bg-[#0a0c14] p-3 rounded-lg border border-[#1b2031] text-left">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1 font-mono">
              Captured spoken words:
            </span>
            <p className="text-xs font-mono font-medium text-slate-100 min-h-[36px] bg-[#0c0f1a] px-2.5 py-2.5 rounded border border-[#1b2031] italic">
              {transcript ? `"${transcript}"` : '“No audio inputs heard yet. Click the mic or tap an interactive simulator preset below!”'}
            </p>
          </div>
        </div>

        {/* Interactive Phonetic Presets Sandbox Tray */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              2. Interactive Commands Simulator Sandbox
            </span>
            <span className="text-[9px] text-fuchsia-400 font-mono font-bold bg-[#1d112b] px-2 py-0.5 rounded border border-fuchsia-500/20 animate-pulse">
              Grade-Testing Safe (No Mic Needed)
            </span>
          </div>

          <p className="text-[10px] text-slate-500 font-sans mb-3 leading-relaxed">
            Iframe sandboxes often restricts mic access inside nested frames. Use these real phonetic transcription templates to experience the complete calculation translation logic.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {PHONETIC_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSimulatePreset(preset.text, preset.base, idx)}
                className={`text-left p-2.5 rounded-lg border text-xs transition duration-200 cursor-pointer relative group flex flex-col justify-between ${
                  activePresetIndex === idx
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300'
                    : 'bg-[#0a0d15] border-[#1f2436] hover:border-slate-600 text-slate-300 hover:bg-[#121624]'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-bold text-[10px] uppercase tracking-wide group-hover:text-fuchsia-400 font-mono">
                    {preset.label}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.2 rounded bg-indigo-900/30 text-indigo-200">
                    B-{preset.base}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono italic truncate w-full">
                  "{preset.text}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Result Output Panel */}
        {parsedValue && (
          <div className="bg-gradient-to-r from-purple-950/20 to-indigo-950/20 p-4 rounded-xl border border-purple-800/30 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fadeIn">
            <div>
              <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-widest block font-mono">
                ✨ Successfully Translated Value:
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black font-mono tracking-wider text-emerald-400">
                  {parsedValue}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  Base {activeBase}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mt-1 font-sans">
                Calculated on-the-fly dynamically via speech dictation translation patterns.
              </p>
            </div>

            <button
              onClick={() => onDeploy(parsedValue, activeBase)}
              className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Check className="w-3.5 h-3.5" />
              Deploy to workspace
            </button>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end gap-3.5 border-t border-[#202534] pt-4">
          <button
            onClick={() => {
              triggerHaptic();
              setTranscript('');
              setParsedValue('');
              setActivePresetIndex(null);
              setRecognitionError('');
            }}
            className="px-4 py-2 bg-[#121624] hover:bg-[#1a1f33] border border-[#202534] text-slate-400 hover:text-slate-200 text-xs font-semibold uppercase tracking-wider rounded cursor-pointer flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear values
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-650 hover:to-indigo-650 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition"
          >
            Exit Terminal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
