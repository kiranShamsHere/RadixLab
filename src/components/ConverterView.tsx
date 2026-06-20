/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BaseType } from '../types';
import { convertBase, validateInput, convertToGray, convertToBCD } from '../utils/converter';
import { ArrowLeftRight, CheckCircle2, AlertCircle, Copy, HelpCircle, Sparkles, Mic, MicOff, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic, triggerSuccessBeep } from '../utils/haptics';
import { parseSpeechToNumber } from '../utils/speech';
import { generateConversionSteps, toSubscript } from '../utils/mathSteps';

interface ConverterViewProps {
  initialInput?: string;
  initialFromBase?: number;
  initialToBase?: number;
  onAddHistory: (input: string, fromBase: number, toBase: number, result: string) => void;
}

const PRESET_BASES = [
  { name: 'Binary', value: 2 },
  { name: 'Octal', value: 8 },
  { name: 'Decimal', value: 10 },
  { name: 'Hexadecimal', value: 16 },
];

export default function ConverterView({
  initialInput = '',
  initialFromBase = 10,
  initialToBase = 2,
  onAddHistory,
}: ConverterViewProps) {
  const [inputVal, setInputVal] = React.useState(initialInput);
  const [fromBase, setFromBase] = React.useState<number>(initialFromBase);
  const [toBase, setToBase] = React.useState<number>(initialToBase);

  const [customFrom, setCustomFrom] = React.useState<string>('3');
  const [customTo, setCustomTo] = React.useState<string>('5');

  const [showCustomFrom, setShowCustomFrom] = React.useState(false);
  const [showCustomTo, setShowCustomTo] = React.useState(false);

  const [copied, setCopied] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [favorites, setFavorites] = React.useState<any[]>([]);

  // Load Favorites and subscribe to events
  const loadFavorites = () => {
    const saved = localStorage.getItem('adv_num_conv_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {}
    } else {
      setFavorites([]);
    }
  };

  React.useEffect(() => {
    loadFavorites();
    window.addEventListener('favorites-updated', loadFavorites);
    return () => window.removeEventListener('favorites-updated', loadFavorites);
  }, []);

  // Actual base numbers resolves
  const actualFromBase = fromBase === -1 ? Math.max(2, Math.min(36, parseInt(customFrom) || 3)) : fromBase;
  const actualToBase = toBase === -1 ? Math.max(2, Math.min(36, parseInt(customTo) || 5)) : toBase;

  const isCurrentFavorite = React.useMemo(() => {
    return favorites.some(
      (f) => f.input === inputVal && f.fromBase === actualFromBase && f.toBase === actualToBase
    );
  }, [favorites, inputVal, actualFromBase, actualToBase]);

  const toggleFavorite = () => {
    triggerHaptic();
    if (!inputVal || !isValid) return;
    
    let nextFavorites = [...favorites];
    if (isCurrentFavorite) {
      nextFavorites = nextFavorites.filter(
        (f) => !(f.input === inputVal && f.fromBase === actualFromBase && f.toBase === actualToBase)
      );
    } else {
      const title = `Base ${actualFromBase} ➔ Base ${actualToBase} [ ${inputVal} ]`;
      nextFavorites.push({
        id: Math.random().toString(36).substring(2, 9),
        title,
        input: inputVal,
        fromBase: actualFromBase,
        toBase: actualToBase
      });
      triggerSuccessBeep();
    }
    setFavorites(nextFavorites);
    localStorage.setItem('adv_num_conv_favorites', JSON.stringify(nextFavorites));
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const handleVoiceInput = () => {
    triggerHaptic();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not fully supported in this browser. Please use Chrome, Edge or open in a new window!");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const parsed = parseSpeechToNumber(transcript, actualFromBase);
      if (parsed) {
        setInputVal(parsed);
        triggerSuccessBeep();
      }
    };
    
    recognition.start();
  };

  React.useEffect(() => {
    if (initialInput) setInputVal(initialInput);
    if (initialFromBase) {
      if (PRESET_BASES.some((b) => b.value === initialFromBase)) {
        setFromBase(initialFromBase);
        setShowCustomFrom(false);
      } else {
        setFromBase(-1);
        setCustomFrom(initialFromBase.toString());
        setShowCustomFrom(true);
      }
    }
    if (initialToBase) {
      if (PRESET_BASES.some((b) => b.value === initialToBase)) {
        setToBase(initialToBase);
        setShowCustomTo(false);
      } else {
        setToBase(-1);
        setCustomTo(initialToBase.toString());
        setShowCustomTo(true);
      }
    }
  }, [initialInput, initialFromBase, initialToBase]);

  // Validation
  const isValid = React.useMemo(() => {
    return validateInput(inputVal, actualFromBase);
  }, [inputVal, actualFromBase]);

  // Converting
  const conversionResult = React.useMemo(() => {
    if (!inputVal || !isValid) return '';
    try {
      return convertBase(inputVal, actualFromBase, actualToBase);
    } catch {
      return 'Error';
    }
  }, [inputVal, actualFromBase, actualToBase, isValid]);

  // Add history trigger
  React.useEffect(() => {
    if (conversionResult && conversionResult !== 'Error' && isValid) {
      const handler = setTimeout(() => {
        onAddHistory(inputVal, actualFromBase, actualToBase, conversionResult);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [conversionResult, inputVal, actualFromBase, actualToBase, isValid]);

  const handleSwap = () => {
    triggerHaptic();
    if (fromBase === -1 || toBase === -1) {
      // Swap custom controls states
      const tempShow = showCustomFrom;
      setShowCustomFrom(showCustomTo);
      setShowCustomTo(tempShow);

      const tempCustom = customFrom;
      setCustomFrom(customTo);
      setCustomTo(tempCustom);
    }

    const tempBase = fromBase;
    setFromBase(toBase);
    setToBase(tempBase);

    if (conversionResult && conversionResult !== 'Error') {
      setInputVal(conversionResult);
    }
  };

  const copyToClipboard = () => {
    triggerHaptic();
    if (!conversionResult) return;
    navigator.clipboard.writeText(conversionResult);
    setCopied(true);
    triggerSuccessBeep();
    setTimeout(() => setCopied(false), 200);
  };

  // Quick all-base list for decimal summary
  const allBasesSummary = React.useMemo(() => {
    if (!inputVal || !isValid) return [];
    try {
      return [
        { name: 'Binary (2)', value: convertBase(inputVal, actualFromBase, 2) },
        { name: 'Octal (8)', value: convertBase(inputVal, actualFromBase, 8) },
        { name: 'Decimal (10)', value: convertBase(inputVal, actualFromBase, 10) },
        { name: 'Hexadecimal (16)', value: convertBase(inputVal, actualFromBase, 16) },
      ];
    } catch {
      return [];
    }
  }, [inputVal, actualFromBase, isValid]);

  // Gray code & BCD conversions
  const binaryRep = React.useMemo(() => {
    if (!inputVal || !isValid) return '';
    try {
      return convertBase(inputVal, actualFromBase, 2);
    } catch {
      return '';
    }
  }, [inputVal, actualFromBase, isValid]);

  const bcdRep = React.useMemo(() => {
    if (!inputVal || !isValid) return '';
    try {
      const dec = convertBase(inputVal, actualFromBase, 10);
      if (/^\+?\d+$/.test(dec.split('.')[0])) {
        return convertToBCD(dec.split('.')[0]);
      }
      return '';
    } catch {
      return '';
    }
  }, [inputVal, actualFromBase, isValid]);

  const grayRep = React.useMemo(() => {
    if (!binaryRep) return '';
    try {
      const cleanBin = binaryRep.split('.')[0].replace(/[^01]/g, '');
      return convertToGray(cleanBin);
    } catch {
      return '';
    }
  }, [binaryRep]);

  const mathSteps = React.useMemo(() => {
    if (!inputVal || !isValid) return null;
    return generateConversionSteps(inputVal, actualFromBase, actualToBase);
  }, [inputVal, actualFromBase, actualToBase, isValid]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Interactive Multi-Base Converter
        </h2>

        {/* Base Configuration Controllers */}
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 mb-6">
          <div className="md:col-span-4 space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Convert From</label>
            <div className="flex gap-2">
              <select
                value={fromBase}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFromBase(val);
                  setShowCustomFrom(val === -1);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer uppercase tracking-wider"
              >
                {PRESET_BASES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.name} (Base {b.value})
                  </option>
                ))}
                <option value="-1">Custom Base...</option>
              </select>
              {showCustomFrom && (
                <input
                  type="number"
                  min="2"
                  max="36"
                  placeholder="Base"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg text-center outline-none text-xs text-indigo-400 focus:border-indigo-500 font-mono transition"
                />
              )}
            </div>
          </div>

          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              onClick={handleSwap}
              className="p-3 bg-slate-950 border border-slate-700 hover:border-indigo-500 text-indigo-450 hover:text-indigo-400 rounded-full transition shadow-md"
              title="Swap From and To bases"
            >
              <ArrowLeftRight className="w-4 h-4 cursor-pointer" />
            </button>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Convert To</label>
            <div className="flex gap-2">
              <select
                value={toBase}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setToBase(val);
                  setShowCustomTo(val === -1);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer uppercase tracking-wider"
              >
                {PRESET_BASES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.name} (Base {b.value})
                  </option>
                ))}
                <option value="-1">Custom Base...</option>
              </select>
              {showCustomTo && (
                <input
                  type="number"
                  min="2"
                  max="36"
                  placeholder="Base"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg text-center outline-none text-xs text-indigo-400 focus:border-indigo-500 font-mono transition"
                />
              )}
            </div>
          </div>
        </div>

        {/* Input Panel */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                Enter Base {actualFromBase} Number:
              </label>
              {inputVal && (
                <span
                  className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                    isValid
                      ? 'bg-emerald-950/55 border border-emerald-800 text-emerald-400'
                      : 'bg-rose-950/55 border border-rose-800 text-rose-400'
                  }`}
                >
                  {isValid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Valid Base {actualFromBase}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> Invalid Characters
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                  triggerHaptic();
                  setInputVal(e.target.value);
                }}
                className={`w-full bg-slate-950 border ${isListening ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-slate-800' } focus:border-indigo-500 rounded-lg pl-4 pr-12 py-3.5 text-base font-mono text-slate-100 placeholder:text-slate-600 outline-none transition`}
                placeholder={`e.g., ${
                  actualFromBase === 10 ? '42.375' : actualFromBase === 2 ? '101010' : 'A5.F'
                }`}
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute right-3 p-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isListening 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-900/80'
                }`}
                title={isListening ? "Listening... click to deactivate voice dictation" : "Enable voice input dictation"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Results Output */}
          <AnimatePresence>
            {conversionResult && isValid && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="bg-slate-950 border border-slate-800 rounded-lg p-5"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Result (Base {actualToBase})</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleFavorite}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-semibold transition cursor-pointer"
                      title={isCurrentFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                      <span>{isCurrentFavorite ? 'Favorited' : 'Favorite'}</span>
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Copied!' : 'Copy Result'}
                    </button>
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-indigo-400 break-all select-all selection:bg-indigo-500/20">
                  {conversionResult}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Auxiliary Outputs / Visual Representations */}
      {isValid && inputVal && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Base Grid */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-[10px] uppercase tracking-wider font-bold text-slate-200 mb-4">All Standard Representations</h3>
            <div className="space-y-3">
              {allBasesSummary.map((base) => {
                let colorClass = 'text-slate-200';
                if (base.name.includes('Binary')) colorClass = 'text-emerald-400';
                else if (base.name.includes('Octal')) colorClass = 'text-sky-400';
                else if (base.name.includes('Hexadecimal')) colorClass = 'text-amber-400';
                
                return (
                  <div
                    key={base.name}
                    className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3"
                  >
                    <span className="text-xs font-semibold text-slate-400">{base.name}</span>
                    <span className={`text-sm font-mono font-bold break-all text-right max-w-[200px] ${colorClass}`}>
                      {base.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Computer Formats (Gray Code, BCD) */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-[10px] uppercase tracking-wider font-bold text-slate-200 mb-4">Digital logic encodings</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    Gray Code
                    <span className="text-[10px] text-indigo-400 italic">(From binary integer)</span>
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-indigo-400 break-all">
                  {grayRep || 'N/A'}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    BCD (Binary Coded Decimal)
                    <span className="text-[10px] text-fuchsia-400 italic">(From base-10 digits)</span>
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-fuchsia-400 break-all">
                  {bcdRep || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step by Step Conversions Explainer Section */}
      {isValid && inputVal && mathSteps && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <HelpCircle className="w-4.5 h-4.5 text-indigo-400" />
              Comprehensive Step-by-Step Mathematical Solver
            </h3>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-bold">
              Base {actualFromBase} ➔ Base {actualToBase}
            </span>
          </div>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
            {/* Phase 1: To Decimal */}
            <div className="bg-slate-950/80 rounded-lg p-5 border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-455 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                    Phase 1: Conversion to Intermediate Decimal (Base 10)
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Calculate the weighted summation of your digits using exponential powers of the source base <span className="text-indigo-400 font-bold">{actualFromBase}</span>.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 pl-9 pt-1 font-mono text-xs">
                {/* Positional Weighted formula */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded p-3 text-slate-300 overflow-x-auto whitespace-nowrap">
                  <span className="text-amber-400 font-bold">{mathSteps.input}</span>
                  <span className="text-[10px] text-slate-500">{toSubscript(actualFromBase)}</span>
                  <span> = </span>
                  <span className="text-slate-200">{mathSteps.toDecimalFormula}</span>
                </div>

                {/* Substituted decimal values */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded p-3 text-slate-300 overflow-x-auto whitespace-nowrap">
                  <span>Substituted: </span>
                  <span className="text-indigo-300">{mathSteps.toDecimalSummed}</span>
                </div>

                {/* Combined Decimal Result */}
                <div className="bg-slate-900 border border-slate-800 rounded p-3 text-emerald-400 font-bold">
                  ➔ Result₁₀ = {mathSteps.decimalValue}
                </div>
              </div>
            </div>

            {/* Phase 2: To Target Base */}
            <div className="bg-slate-950/80 rounded-lg p-5 border border-slate-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wide">
                    Phase 2: Conversion from Decimal₁₀ to Base {actualToBase}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Repeatedly divide the decimal integer by <span className="text-fuchsia-455 text-fuchsia-400 font-bold">{actualToBase}</span>, collecting the remainders from bottom to top. For fractional values, multiply the fractional part by <span className="text-fuchsia-400 font-bold">{actualToBase}</span>.
                  </p>
                </div>
              </div>

              <div className="pl-9 space-y-4">
                {/* Repeated Division list */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Repeated Division Steps (Integer Part):</span>
                  <div className="border border-slate-800 rounded-lg overflow-x-auto font-mono text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-455 text-slate-400 text-[10px] uppercase">
                          <th className="p-2.5">Dividend</th>
                          <th className="p-2.5">÷ Base</th>
                          <th className="p-2.5">Quotient</th>
                          <th className="p-2.5">Remainder (Base 10)</th>
                          <th className="p-2.5 text-fuchsia-400 font-bold">In Base {actualToBase}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {mathSteps.divisionSteps.map((step, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/30">
                            <td className="p-2.5 text-slate-300">{step.dividend}</td>
                            <td className="p-2.5 text-slate-500">÷ {step.divisor}</td>
                            <td className="p-2.5 text-slate-300">{step.quotient}</td>
                            <td className="p-2.5 text-slate-400">{step.remainder}</td>
                            <td className="p-2.5 text-fuchsia-400 font-bold">{step.remainderChar}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-slate-500 italic font-sans leading-relaxed">
                    Reading the remainders from the last step upwards: <span className="text-fuchsia-400 font-bold font-mono">{mathSteps.divisionSteps.map(s => s.remainderChar).reverse().join('') || '0'}</span>.
                  </p>
                </div>

                {/* Repeated Multiplication list if there is visual fractional content */}
                {mathSteps.hasFractional && mathSteps.multiplicationSteps.length > 0 && (
                  <div className="space-y-2 pt-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Repeated Multiplication Steps (Fractional Part):</span>
                    <div className="border border-slate-800 rounded-lg overflow-x-auto font-mono text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                            <th className="p-2.5">Fractional</th>
                            <th className="p-2.5">× Base</th>
                            <th className="p-2.5">Product</th>
                            <th className="p-2.5 text-fuchsia-400 font-bold">Integer Part (Digit)</th>
                            <th className="p-2.5">Remainder Fraction</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {mathSteps.multiplicationSteps.map((step, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/30">
                              <td className="p-2.5 text-slate-300">{step.fractional.toFixed(6).replace(/\.?0+$/, '')}</td>
                              <td className="p-2.5 text-slate-500">× {step.multiplier}</td>
                              <td className="p-2.5 text-slate-300">{step.product.toFixed(6).replace(/\.?0+$/, '')}</td>
                              <td className="p-2.5 text-fuchsia-400 font-bold">{step.digit.toString(toBase).toUpperCase()}</td>
                              <td className="p-2.5 text-slate-400">{step.remaining.toFixed(6).replace(/\.?0+$/, '')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-slate-500 italic font-sans leading-relaxed">
                      Reading the accumulated digit carries from top to bottom: <span className="text-fuchsia-400 font-bold font-mono">.{mathSteps.multiplicationSteps.map(s => s.digit.toString(toBase).toUpperCase()).join('')}</span>.
                    </p>
                  </div>
                )}

                {/* Final Combined Formula representation banner */}
                <div className="bg-slate-900/60 border border-slate-800 rounded p-4 text-xs font-mono">
                  <div className="text-slate-400 text-[10px] mb-1.5 uppercase tracking-wide font-sans">Final Converted Representation:</div>
                  <div className="flex flex-col sm:flex-row items-baseline gap-2 text-sm">
                    <span className="text-slate-300 font-bold">
                      ({mathSteps.input}){toSubscript(actualFromBase)}
                    </span>
                    <span className="text-slate-400">is mathematically equivalent to</span>
                    <span className="text-indigo-400 font-black text-base">
                      ({conversionResult}){toSubscript(actualToBase)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
