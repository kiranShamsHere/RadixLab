import React, { useState, useEffect } from 'react';
import { Database, Copy, RefreshCw } from 'lucide-react';

interface UnitRow {
  name: string;
  symbol: string;
  bitsValue: number;
}

export default function BytesBitsView() {
  const [amount, setAmount] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('MB');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  // Constants mapping base bits
  const unitBits: { [key: string]: number } = {
    'bit': 1,
    'B': 8,
    'KB': 8 * 1000,
    'KiB': 8 * 1024,
    'MB': 8 * Math.pow(1000, 2),
    'MiB': 8 * Math.pow(1024, 2),
    'GB': 8 * Math.pow(1000, 3),
    'GiB': 8 * Math.pow(1024, 3),
    'TB': 8 * Math.pow(1000, 4),
    'TiB': 8 * Math.pow(1024, 4),
  };

  const getConversions = () => {
    const rawBits = amount * (unitBits[selectedUnit] || 1);
    
    return [
      { name: 'Bits', symbol: 'bit', value: rawBits / unitBits['bit'] },
      { name: 'Bytes', symbol: 'B', value: rawBits / unitBits['B'] },
      { name: 'Kilobytes (Decimal)', symbol: 'KB', value: rawBits / unitBits['KB'] },
      { name: 'Kibibytes (Binary)', symbol: 'KiB', value: rawBits / unitBits['KiB'] },
      { name: 'Megabytes (Decimal)', symbol: 'MB', value: rawBits / unitBits['MB'] },
      { name: 'Mebibytes (Binary)', symbol: 'MiB', value: rawBits / unitBits['MiB'] },
      { name: 'Gigabytes (Decimal)', symbol: 'GB', value: rawBits / unitBits['GB'] },
      { name: 'Gibibytes (Binary)', symbol: 'GiB', value: rawBits / unitBits['GiB'] },
      { name: 'Terabytes (Decimal)', symbol: 'TB', value: rawBits / unitBits['TB'] },
      { name: 'Tebibytes (Binary)', symbol: 'TiB', value: rawBits / unitBits['TiB'] },
    ];
  };

  const copyValue = (val: number, symbol: string) => {
    navigator.clipboard.writeText(val.toString());
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 1000);
  };

  const conversions = getConversions();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Database className="w-4 h-4 text-indigo-400" />
        Data Storage Bytes & Bits Converter
      </h2>

      <p className="text-xs text-slate-450 mb-6 font-sans">
        Compare storage magnitudes, highlighting differences between decimal prefix (10<sup>3</sup>) and binary SI standards (2<sup>10</sup>).
      </p>

      {/* Inputs box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">Magnitude Magnitude Value</label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition font-mono"
            placeholder="e.g. 1"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">Base Unit Selection</label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="bit">bit (Bits)</option>
            <option value="B">B (Bytes)</option>
            <option value="KB">KB (Kilobytes)</option>
            <option value="KiB">KiB (Kibibytes)</option>
            <option value="MB">MB (Megabytes)</option>
            <option value="MiB">MiB (Mebibytes)</option>
            <option value="GB">GB (Gigabytes)</option>
            <option value="GiB">GiB (Gibibytes)</option>
            <option value="TB">TB (Terabytes)</option>
            <option value="TiB">TiB (Tebibytes)</option>
          </select>
        </div>
      </div>

      {/* Grid of outcomes */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Equivalent Storage Units</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {conversions.map((u) => (
            <div key={u.symbol} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 font-mono text-xs flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-500 font-bold block mb-0.5">{u.name} ({u.symbol})</span>
                <span className="text-slate-200 font-bold text-sm">
                  {u.value.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </span>
              </div>
              <button
                onClick={() => copyValue(u.value, u.symbol)}
                className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 rounded text-[10px] uppercase font-bold cursor-pointer transition"
              >
                {copiedSymbol === u.symbol ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
