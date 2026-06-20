/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { calculateTwosComplement } from '../utils/converter';
import { ToggleLeft, HelpCircle, Check, PlayCircle } from 'lucide-react';

export default function SignedComplementView() {
  const [val, setVal] = React.useState<string>('-42');
  const [bits, setBits] = React.useState<number>(8);

  const [result, setResult] = React.useState<any>(null);
  const [errorMsg, setErrorMessage] = React.useState<string>('');

  const calculate = () => {
    setErrorMessage('');
    setResult(null);

    if (!val.trim()) {
      return;
    }

    try {
      const res = calculateTwosComplement(val, bits);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred during signed conversion.');
    }
  };

  React.useEffect(() => {
    calculate();
  }, [val, bits]);

  const limits = React.useMemo(() => {
    const max = Math.pow(2, bits - 1) - 1;
    const min = -Math.pow(2, bits - 1);
    return { min, max };
  }, [bits]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <ToggleLeft className="w-4 h-4 text-indigo-400" />
        1's & 2's Complement Signed Calculator
      </h2>
      <p className="text-xs text-slate-450 mb-6 font-sans">
        Explore signed integer representations used in digital micro-architectures. Track active bits and sign extensions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Signed Value (Decimal or Binary with '0b')</label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-base font-mono text-slate-100 placeholder:text-slate-700 outline-none transition"
            placeholder="e.g., -42 or 0b101010"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-sans">Bus Bit-Width</label>
          <select
            value={bits}
            onChange={(e) => setBits(parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer font-mono"
          >
            <option value="8">8-Bit (Byte)</option>
            <option value="16">16-Bit (Half-Word)</option>
            <option value="32">32-Bit (Word)</option>
          </select>
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center gap-2 justify-between">
        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-sans">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Representable boundaries for active size:</span>
        </div>
        <span className="text-xs font-bold font-mono text-indigo-400">
          Min {limits.min} to Max {limits.max}
        </span>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-955/65 border border-rose-800 rounded-lg text-xs text-rose-400 mb-6 font-semibold">
          {errorMsg}
        </div>
      )}

      {result && !errorMsg && (
        <div className="space-y-6">
          {/* Main signed tables representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4.5 font-mono">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                Unsigned Binary Magnitude
              </span>
              <span className="text-lg font-bold text-slate-200 break-all">{result.binary}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4.5 font-mono">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                One's Complement (Bitwise NOT)
              </span>
              <span className="text-lg font-bold text-slate-200 break-all">{result.onesComplement}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4.5 font-mono md:col-span-2 border-l-2 border-l-indigo-500">
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
                Two's Complement (Digital Hardware Standard)
              </span>
              <span className="text-xl font-bold text-indigo-300 break-all">{result.twosComplement}</span>
            </div>
          </div>

          {/* Interactive Bit-Extended visualizer sequence logic */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <h3 className="text-xs font-semibold text-slate-450 mb-4 inline-flex items-center gap-1.5 uppercase tracking-wide">
              <PlayCircle className="w-4 h-4 text-indigo-400" />
              Bus Bit Matrix & Sign Extension
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {result.twosComplement.split('').map((bit: string, idx: number) => {
                const isSignBit = idx === 0;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-11 border flex items-center justify-center font-mono font-bold text-base rounded transition ${
                        isSignBit
                          ? 'bg-rose-95/60 border-rose-800 text-rose-300'
                          : bit === '1'
                          ? 'bg-indigo-950/60 border-indigo-850 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                      title={isSignBit ? 'Most Significant Bit (Sign Bit)' : `Bit position index ${bits - 1 - idx}`}
                    >
                      {bit}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {isSignBit ? 'MSB (S)' : bits - 1 - idx}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-[10px]/none justify-center text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-900/80 border border-rose-800 rounded-sm" /> Red = Sign Active Bit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-900/80 border border-indigo-850 rounded-sm" /> Indigo = Active Bits (1)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
