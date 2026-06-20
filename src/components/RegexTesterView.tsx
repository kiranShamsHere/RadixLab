import React, { useState, useEffect } from 'react';
import { Sparkles, Code, CheckCircle, AlertTriangle } from 'lucide-react';

export default function RegexTesterView() {
  const [pattern, setPattern] = useState<string>('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({ g: true, i: true, m: false });
  const [testText, setTestText] = useState<string>('Send logs to support@example.com or user.name@domain.co.uk immediately.');
  
  const [matches, setMatches] = useState<{ value: string; index: number; groups: string[] }[]>([]);
  const [isPatternValid, setIsPatternValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const runRegexMatch = () => {
    if (!pattern) {
      setMatches([]);
      setIsPatternValid(true);
      setErrorMessage('');
      return;
    }
    try {
      let flagStr = '';
      if (flags.g) flagStr += 'g';
      if (flags.i) flagStr += 'i';
      if (flags.m) flagStr += 'm';

      const regex = new RegExp(pattern, flagStr);
      setIsPatternValid(true);
      setErrorMessage('');

      const results = [];
      if (flags.g) {
        let match;
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1).filter(Boolean),
          });
          // Prevent infinite loops on empty matches
          if (match[0] === '') regex.lastIndex++;
        }
      } else {
        const match = testText.match(regex);
        if (match) {
          results.push({
            value: match[0],
            index: match.index || 0,
            groups: match.slice(1).filter(Boolean),
          });
        }
      }
      setMatches(results);
    } catch (e: any) {
      setIsPatternValid(false);
      setErrorMessage(e.message || 'Invalid regular expression format');
      setMatches([]);
    }
  };

  useEffect(() => {
    runRegexMatch();
  }, [pattern, flags, testText]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Code className="w-4 h-4 text-indigo-400" />
        DLD Pattern Regex Tester
      </h2>

      <p className="text-xs text-slate-450 mb-6 font-sans">
        Validate custom regular expression layouts and capture logical group structures over message buffers.
      </p>

      <div className="space-y-4">
        {/* Regex Input and flags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400">Regular Expression Pattern</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className={`w-full bg-slate-950 border rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100 outline-none ${
                isPatternValid ? 'border-slate-700 focus:border-indigo-500' : 'border-rose-800'
              }`}
              placeholder="e.g. [A-Z]+"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Matching Flag Modifiers</label>
            <div className="flex bg-slate-950 border border-slate-700 rounded-lg overflow-hidden h-[38px] justify-around items-center">
              <label className="text-[10px] font-bold text-slate-300 font-mono flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.g}
                  onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                  className="accent-indigo-500 rounded"
                />
                Global
              </label>
              <label className="text-[10px] font-bold text-slate-300 font-mono flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.i}
                  onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                  className="accent-indigo-500 rounded"
                />
                Insensitive
              </label>
              <label className="text-[10px] font-bold text-slate-300 font-mono flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.m}
                  onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                  className="accent-indigo-500 rounded"
                />
                Multiline
              </label>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-955 border border-rose-800 text-rose-400 rounded-lg text-xs flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Text Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">Payload text buffer</label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
            placeholder="Type your testing payload material here..."
          />
        </div>

        {/* Results */}
        {isPatternValid && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Match summary</span>
              <span className="text-[10px] bg-indigo-950/50 border border-indigo-900 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded">
                Found {matches.length} matches
              </span>
            </div>

            {matches.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {matches.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-955 border border-slate-800 rounded-lg flex flex-col font-mono text-xs gap-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Match {idx + 1}</span>
                      <span className="text-[9px] text-slate-500">Char Index: {item.index}</span>
                    </div>
                    <div className="text-slate-200 font-bold break-all">"{item.value}"</div>
                    {item.groups.length > 0 && (
                      <div className="text-[10px] text-slate-450 border-t border-slate-850 pt-1.5">
                        Group captures: {item.groups.map((g, gIdx) => `[${gIdx+1}]: "${g}"`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
                No active matches in buffer
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
