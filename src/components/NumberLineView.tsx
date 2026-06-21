import React, { useState } from 'react';
import { Sliders, HelpCircle } from 'lucide-react';

export default function NumberLineView() {
  const [value, setValue] = useState<number>(0);

  const getBinary = (val: number) => {
    // 8-bit representation
    const uVal = val < 0 ? val + 256 : val;
    return uVal.toString(2).padStart(8, '0');
  };

  const ticks = [-128, -96, -64, -32, 0, 32, 64, 96, 127];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Sliders className="w-4 h-4 text-indigo-400" />
        Interactive Number Line Visualizer
      </h2>

      <p className="text-xs text-slate-400 mb-6 font-sans">
        Explore signed integer coordinates across an 8-bit range, tracking boundary margins and midpoints.
      </p>

      {/* Visual Number Line Axis */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 mb-6">
        <div className="relative pt-6 pb-6">
          {/* Main Axis Line */}
          <div className="absolute w-full h-[3px] bg-slate-800 rounded-full top-[27px]" />

          {/* Value Indicator Bubble */}
          <div
            className="absolute top-1 transform -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-100"
            style={{ left: `${((value + 128) / 255) * 100}%` }}
          >
            <span className="bg-indigo-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px] shadow border border-indigo-500">
              {value}
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-white mt-1 shadow-md" />
          </div>

          {/* Tick Positions */}
          <div className="relative flex justify-between pt-5">
            {ticks.map((t) => (
              <button
                key={t}
                onClick={() => setValue(t)}
                className="flex flex-col items-center hover:opacity-100 transition duration-150 cursor-pointer"
                style={{ width: '20px' }}
              >
                <div className="h-2 w-[1.5px] bg-slate-600 mb-1" />
                <span className="text-[9px] text-slate-500 font-mono font-bold">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main slider */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
          <span>Move Slider Offset</span>
          <span className="text-indigo-400 font-mono">Offset: {value}</span>
        </div>
        <input
          type="range"
          min={-128}
          max={127}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value) || 0)}
          className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-505 accent-indigo-500"
        />
      </div>

      {/* Byte representations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Binary */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Binary Byte</span>
          <span className="text-xs font-bold text-emerald-400">{getBinary(value)}</span>
        </div>

        {/* Hex representation */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">HEX Equivalent</span>
          <span className="text-sm font-bold text-amber-400">
            0x{(value < 0 ? value + 256 : value).toString(16).toUpperCase()}
          </span>
        </div>

        {/* Octal representation */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Octal Equivalent</span>
          <span className="text-sm font-bold text-sky-400">
            0o{(value < 0 ? value + 256 : value).toString(8)}
          </span>
        </div>

        {/* Sign bit state */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Sign Bit</span>
          <span className={`text-xs font-bold ${value < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {value < 0 ? '1 (Negative)' : '0 (Positive)'}
          </span>
        </div>
      </div>
    </div>
  );
}
