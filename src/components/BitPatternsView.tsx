import React, { useState } from 'react';
import { ToggleLeft, HelpCircle } from 'lucide-react';

export default function BitPatternsView() {
  const [bitWidth, setBitWidth] = useState<8 | 16 | 32>(8);
  const [bits, setBits] = useState<number[]>(Array(8).fill(0));

  const changeBitWidth = (width: 8 | 16 | 32) => {
    setBitWidth(width);
    setBits(Array(width).fill(0));
  };

  const handleBitToggle = (index: number) => {
    const nextBits = [...bits];
    nextBits[index] = nextBits[index] === 0 ? 1 : 0;
    setBits(nextBits);
  };

  const getUnsignedValue = () => {
    let sum = 0;
    bits.forEach((b, idx) => {
      if (b === 1) {
        sum += Math.pow(2, bitWidth - 1 - idx);
      }
    });
    return sum;
  };

  const getSignedValue = () => {
    if (bits[0] === 0) return getUnsignedValue();
    return getUnsignedValue() - Math.pow(2, bitWidth);
  };

  const unsigned = getUnsignedValue();
  const signed = getSignedValue();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <ToggleLeft className="w-4 h-4 text-indigo-400" />
        Interactive Binary Bit Grid Patterns
      </h2>

      <p className="text-xs text-slate-400 mb-6 font-sans">
        Toggle individual bits in register buses below to see real-time logic shifts for unsigned and signed numbers.
      </p>

      {/* Bit length choice */}
      <div className="flex border border-slate-700 rounded-lg overflow-hidden h-[42px] mb-6">
        {[8, 16, 32].map((w) => (
          <button
            key={w}
            onClick={() => changeBitWidth(w as 8 | 16 | 32)}
            className={`flex-1 text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
              bitWidth === w ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
            }`}
          >
            {w}-Bit Width
          </button>
        ))}
      </div>

      {/* Bit pattern grid boxes */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] uppercase font-bold text-slate-400 mb-4 font-mono gap-2">
          <span>Bit index mapping (MSB to LSB)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBits(Array(bitWidth).fill(0))}
              className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[9px] font-bold tracking-wider rounded text-slate-400 hover:text-slate-100 cursor-pointer transition"
            >
              All 0s
            </button>
            <button
              onClick={() => setBits(Array(bitWidth).fill(1))}
              className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-indigo-750 text-[9px] font-bold tracking-wider rounded text-slate-400 hover:text-indigo-400 cursor-pointer transition"
            >
              All 1s
            </button>
            <button
              onClick={() => setBits(bits.map(b => b === 0 ? 1 : 0))}
              className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-indigo-750 text-[9px] font-bold tracking-wider rounded text-slate-400 hover:text-indigo-400 cursor-pointer transition"
            >
              Invert
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {bits.map((bit, idx) => {
            const indexLabel = bitWidth - 1 - idx;
            return (
              <div key={idx} className="flex flex-col items-center">
                <button
                  onClick={() => handleBitToggle(idx)}
                  className={`w-10 h-11 border flex items-center justify-center font-mono font-bold text-base rounded transition cursor-pointer select-none ${
                    bit === 1
                      ? 'bg-indigo-950/60 border-indigo-850 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-705'
                  }`}
                  title={`Toggle bit at index ${indexLabel}`}
                >
                  {bit}
                </button>
                <span className="text-[9px] text-slate-600 font-mono mt-1">b{indexLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversions summary list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Binary */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Binary Array</span>
          <span className="text-xs font-bold text-emerald-400 break-all">{bits.join('')}</span>
        </div>

        {/* Unsigned Decimal */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Unsigned Dec</span>
          <span className="text-sm font-bold text-slate-100">{unsigned}</span>
        </div>

        {/* Signed Two's Dec */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Two's Signed</span>
          <span className="text-sm font-bold text-indigo-400">{signed}</span>
        </div>

        {/* Hexadecimal */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Hexadecimal</span>
          <span className="text-sm font-bold text-amber-400">0x{unsigned.toString(16).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
