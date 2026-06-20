import React, { useState } from 'react';
import { Binary, Copy, Sparkles } from 'lucide-react';

export default function AsciiUnicodeView() {
  const [inputText, setInputText] = useState<string>('Hello!');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getAsciiTable = () => {
    return inputText.split('').map((char, index) => {
      const dec = char.charCodeAt(0);
      const bin = dec.toString(2).padStart(8, '0');
      const oct = dec.toString(8).padStart(3, '0');
      const hex = dec.toString(16).toUpperCase().padStart(2, '0');
      const entity = `&#${dec};`;
      return {
        id: index,
        char: char === ' ' ? 'Space' : char,
        dec,
        bin,
        oct,
        hex,
        entity,
      };
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  const results = getAsciiTable();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Binary className="w-4 h-4 text-indigo-400" />
        ASCII & Unicode Character Encoder
      </h2>

      <p className="text-xs text-slate-450 mb-6">
        Convert arbitrary text lines to multi-base byte arrays, individual code points, and safe HTML entity encodings.
      </p>

      <div className="space-y-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Input String Text</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 transition"
            placeholder="Type anything..."
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase font-bold text-slate-350 tracking-wider">
            Bit Encodings Grid List
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((r, index) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2.5 relative">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <span className="text-indigo-400 font-bold text-sm bg-indigo-950/40 px-2.5 py-1 rounded">
                    '{r.char}'
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Pos: {index + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Decimal:</span>
                    <span className="text-slate-300 font-bold">{r.dec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hexadecimal:</span>
                    <span className="text-slate-300 font-bold">0x{r.hex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Octal:</span>
                    <span className="text-slate-300 font-bold">0o{r.oct}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-slate-500">Binary byte:</span>
                    <span className="text-emerald-400 font-bold">{r.bin}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-850/50">
                  <span className="text-[10px] text-slate-504 text-slate-450">HTML Entity: {r.entity}</span>
                  <button
                    onClick={() => copyToClipboard(r.bin, index)}
                    className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 cursor-pointer hover:text-indigo-300"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedIndex === index ? 'Copied Bin' : 'Copy Bin'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
