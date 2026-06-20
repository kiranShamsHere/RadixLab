import React, { useState } from 'react';
import { Layers, Copy, RefreshCw, Key } from 'lucide-react';

export default function UuidGeneratorView() {
  const [quantity, setQuantity] = useState<number>(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Native cryptographically secure UUID version 4 generator
  const generateUUIDv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) | 0;
      const v = c === 'x' ? r : (r & 3) | 8;
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const list = Array.from({ length: Math.min(50, Math.max(1, quantity)) }).map(() => generateUUIDv4());
    setUuids(list);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  // Generate some defaults on mount if list is vacant
  React.useEffect(() => {
    handleGenerate();
  }, [quantity]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Key className="w-4 h-4 text-indigo-400" />
        UUID Version-4 Token Generator
      </h2>

      <p className="text-xs text-slate-450 mb-6 font-sans">
        Generate multiple universally unique identifiers (UUID version-4) with high-entropy cryptographic seeds.
      </p>

      {/* Control sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-6">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">Token Generation Volume</label>
          <input
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 5)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold uppercase tracking-widest cursor-pointer transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Set
          </button>
          
          {uuids.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-indigo-400 rounded text-xs font-bold uppercase tracking-widest cursor-pointer transition"
            >
              {copiedIndex === -1 ? 'Copied Set' : 'Copy Set'}
            </button>
          )}
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-455 text-slate-400">Generated Identifiers</span>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {uuids.map((uuid, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex justify-between items-center font-mono text-xs hover:border-slate-700 transition"
              >
                <span className="text-slate-300 select-all font-bold">{uuid}</span>
                <button
                  onClick={() => handleCopy(uuid, idx)}
                  className="p-1.5 text-indigo-400 hover:bg-slate-900 rounded cursor-pointer transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold">
                    {copiedIndex === idx ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
