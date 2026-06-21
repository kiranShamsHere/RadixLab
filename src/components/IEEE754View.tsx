/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { convertToIEEE754 } from '../utils/converter';
import { Cpu, HelpCircle, CheckCircle, Info } from 'lucide-react';

export default function IEEE754View() {
  const [val, setVal] = React.useState<string>('3.14159');
  const [is64Bit, setIs64Bit] = React.useState<boolean>(false);

  const [result, setResult] = React.useState<any>(null);
  const [errorMsg, setErrorMessage] = React.useState<string>('');

  const runAnalysis = () => {
    setErrorMessage('');
    setResult(null);

    const trimmed = val.trim();
    if (!trimmed) return;

    try {
      const res = convertToIEEE754(trimmed, is64Bit);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred during floating point translation.');
    }
  };

  React.useEffect(() => {
    runAnalysis();
  }, [val, is64Bit]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Cpu className="w-4 h-4 text-indigo-400" />
        IEEE 754 Floating-Point Representation
      </h2>
      <p className="text-xs text-slate-400 mb-6 font-sans">
        Analyze how real decimals are packed in computer hardware into sign, exponent, and fraction bit segments.
      </p>

      {/* Mode inputs selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Decimal Value</label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-base font-mono text-slate-100 placeholder:text-slate-700 outline-none transition"
            placeholder="e.g., 3.14159 or -0.015625"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-sans">Format Precision</label>
          <div className="flex border border-slate-700 rounded-lg overflow-hidden mt-1 h-[50px]">
            <button
              onClick={() => setIs64Bit(false)}
              className={`flex-1 text-xs font-mono font-bold transition cursor-pointer ${
                !is64Bit ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
              }`}
            >
              32-Bit
            </button>
            <button
              onClick={() => setIs64Bit(true)}
              className={`flex-1 text-xs font-mono font-bold transition cursor-pointer ${
                is64Bit ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
              }`}
            >
              64-Bit
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-400 mb-6 font-semibold">
          {errorMsg}
        </div>
      )}

      {result && !errorMsg && (
        <div className="space-y-6">
          {/* Section bit diagrams */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider mb-2 text-center sm:text-left">
              Bit-Level Packing Breakdowns
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-center">
              {/* Sign bit */}
              <div className="sm:col-span-2 bg-emerald-950/20 border border-emerald-900/60 rounded-lg p-3">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider mb-1">
                  Sign (1b)
                </span>
                <span className="text-lg font-mono font-bold text-emerald-300">{result.sign}</span>
                <span className="text-[9px] text-slate-400 block mt-1">
                  {result.sign === 0 ? '0 (+) Positive' : '1 (-) Negative'}
                </span>
              </div>

              {/* Exponent */}
              <div className="sm:col-span-4 bg-pink-950/20 border border-pink-900/60 rounded-lg p-3">
                <span className="text-[10px] text-pink-400 font-bold block uppercase tracking-wider mb-1">
                  Exponent ({is64Bit ? '11b' : '8b'})
                </span>
                <span className="text-sm font-mono font-bold text-pink-300 break-all">{result.exponent}</span>
                <span className="text-[9px] text-slate-400 block mt-1">
                  Unbiased: {result.biasedExponent}
                </span>
              </div>

              {/* Fraction / Mantissa */}
              <div className="sm:col-span-6 bg-blue-950/20 border border-blue-900/60 rounded-lg p-3">
                <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider mb-1">
                  Fraction ({is64Bit ? '52b' : '23b'})
                </span>
                <span className="text-sm font-mono font-bold text-blue-300 break-all truncate block">
                  {result.mantissa}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1 text-ellipsis overflow-hidden">
                  Fractional magnitude
                </span>
              </div>
            </div>
          </div>

          {/* Value summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-lg font-mono">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">
                IEEE hex equivalent
              </span>
              <span className="text-base text-indigo-400 font-bold">{result.hexRepresentation}</span>
            </div>

            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-lg font-mono">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">
                Actual Exponent Power
              </span>
              <span className="text-base text-slate-200 font-bold">
                {result.biasedExponent} - {is64Bit ? 1023 : 127} = {result.actualExponent}
              </span>
            </div>

            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-lg font-mono">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Precision State</span>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded mt-1.5 ${
                  result.precisionLoss
                    ? 'bg-rose-950/40 border border-rose-900 text-rose-400'
                    : 'bg-emerald-950/40 border border-emerald-900 text-emerald-400'
                }`}
              >
                {result.precisionLoss ? (
                  <>
                    <Info className="w-3 h-3" /> Rounded
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3" /> Exact
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Mathematical Normalized Explanation form equations */}
          <div className="bg-slate-950/80 rounded-lg p-4.5 border border-slate-800">
            <h4 className="font-bold text-[10px] text-indigo-400 mb-2 uppercase tracking-wide">
              Scientific Value Equation
            </h4>
            <div className="font-mono text-sm text-slate-200 p-3 bg-slate-950 rounded border border-slate-800 overflow-x-auto">
              Value = (-1)<sup>{result.sign}</sup> × 1.{result.mantissa.slice(0, 12)}... × 2
              <sup>{result.actualExponent}</sup>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
