import React, { useState } from 'react';
import { Layers, Copy, Play, Pause, Square, FileText, ArrowLeftRight, HelpCircle, AlertTriangle } from 'lucide-react';
import { convertBase, validateInput } from '../utils/converter';

interface BatchResult {
  serial: number;
  input: string;
  from: string;
  to: string;
  valid: boolean;
}

export default function BatchConvertView() {
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(16);
  const [inputMethod, setInputMethod] = useState<'text' | 'file' | 'range' | 'random'>('text');
  
  // Input fields
  const [textInput, setTextInput] = useState<string>('25\n42\n100\n150\n255');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(20);
  const [rangeType, setRangeType] = useState<'seq' | 'fib' | 'prime' | 'square'>('seq');
  const [randomCount, setRandomCount] = useState<number>(10);
  const [randomDist, setRandomDist] = useState<'uniform' | 'normal'>('uniform');

  // Processing state
  const [results, setResults] = useState<BatchResult[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);

  const handleSwap = () => {
    const temp = fromBase;
    setFromBase(toBase);
    setToBase(temp);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTextInput(event.target.result as string);
        setInputMethod('text');
      }
    };
    reader.readAsText(file);
  };

  const generatePrimes = (max: number): number[] => {
    const store: boolean[] = [];
    const primes = [];
    for (let i = 2; i <= max; i++) {
      if (store[i] !== false) {
        primes.push(i);
        for (let j = i << 1; j <= max; j += i) {
          store[j] = false;
        }
      }
    }
    return primes;
  };

  const generateFibonacci = (n: number): number[] => {
    const fibs = [0, 1];
    while (fibs.length < n) {
      fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);
    }
    return fibs.slice(0, n);
  };

  const triggerProcess = () => {
    setProcessing(true);
    setProgress(0);
    
    // Gather numbers
    let numbers: string[] = [];
    if (inputMethod === 'text') {
      numbers = textInput.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    } else if (inputMethod === 'range') {
      if (rangeType === 'seq') {
        for (let i = rangeStart; i <= rangeEnd; i++) numbers.push(i.toString());
      } else if (rangeType === 'prime') {
        const primes = generatePrimes(rangeEnd);
        numbers = primes.filter(p => p >= rangeStart).map(p => p.toString());
      } else if (rangeType === 'fib') {
        const fibs = generateFibonacci(rangeEnd);
        numbers = fibs.filter(f => f >= rangeStart).map(f => f.toString());
      } else if (rangeType === 'square') {
        for (let i = Math.ceil(Math.sqrt(rangeStart)); i * i <= rangeEnd; i++) {
          numbers.push((i * i).toString());
        }
      }
    } else {
      // Random
      for (let i = 0; i < randomCount; i++) {
        let val = 0;
        if (randomDist === 'uniform') {
          val = Math.floor(Math.random() * 1000);
        } else {
          // simple approximation of normal distribution
          val = Math.floor((Math.random() + Math.random() + Math.random()) * 200);
        }
        numbers.push(val.toString());
      }
    }

    const batchRes: BatchResult[] = [];
    const startTime = Date.now();

    // Process immediately
    numbers.forEach((num, index) => {
      const isValid = validateInput(num, fromBase);
      let converted = 'ERROR';
      if (isValid) {
        try {
          converted = convertBase(num, fromBase, toBase);
        } catch {
          // Failsafe
        }
      }
      batchRes.push({
        serial: index + 1,
        input: num,
        from: `Base ${fromBase}`,
        to: converted,
        valid: isValid,
      });
    });

    setTimeout(() => {
      setResults(batchRes);
      setProgress(100);
      setProcessing(false);
      const seconds = (Date.now() - startTime) / 1000;
      setRate(Math.round(numbers.length / (seconds || 0.1)));
    }, 600);
  };

  const exportCSV = () => {
    const headers = 'Serial,Input,From Base,Output\n';
    const rows = results.map(r => `${r.serial},"${r.input}","${r.from}","${r.to}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch_conversion_results_${fromBase}_to_${toBase}.csv`;
    link.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Layers className="w-4 h-4 text-indigo-400" />
        Batch Number Converter
      </h2>

      <p className="text-xs text-slate-450 mb-6">
        Convert multiple numerical entries simultaneously using range sequences or custom input distributions.
      </p>

      {/* From/To Bases Selection */}
      <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 mb-6">
        <div className="md:col-span-5 space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">From Base</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer"
          >
            {[2, 8, 10, 12, 16, 20, 36].map((b) => (
              <option key={b} value={b}>Base {b}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1 flex justify-center pt-5">
          <button
            onClick={handleSwap}
            className="p-3 bg-slate-950 border border-slate-700 hover:border-indigo-500 text-indigo-400 rounded-full transition shadow-md cursor-pointer"
            title="Swap input and output bases"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-5 space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">To Base</label>
          <select
            value={toBase}
            onChange={(e) => setToBase(parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer"
          >
            {[2, 8, 10, 12, 16, 20, 36].map((b) => (
              <option key={b} value={b}>Base {b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Method tabs */}
      <div className="border-b border-slate-700 mb-6 flex gap-4 overflow-x-auto">
        {(['text', 'file', 'range', 'random'] as const).map((method) => (
          <button
            key={method}
            onClick={() => setInputMethod(method)}
            className={`pb-3 text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 px-1 cursor-pointer ${
              inputMethod === method
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-150'
            }`}
          >
            {method === 'text' && 'Manual Entry'}
            {method === 'file' && 'File Import'}
            {method === 'range' && 'Sequence Range'}
            {method === 'random' && 'Random Distribution'}
          </button>
        ))}
      </div>

      {/* Inputs container */}
      <div className="mb-6">
        {inputMethod === 'text' && (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Enter Numbers (Line or Comma Separated)
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 transition"
              placeholder="e.g. 10&#10;25&#10;105"
            />
          </div>
        )}

        {inputMethod === 'file' && (
          <div className="border border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-indigo-500 transition">
            <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-450 mb-3">Upload plain text file with one value per line.</p>
            <input
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="batch-file-input"
            />
            <label
              htmlFor="batch-file-input"
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded text-xs font-bold uppercase tracking-wider select-none cursor-pointer inline-block text-slate-200"
            >
              Select File
            </label>
          </div>
        )}

        {inputMethod === 'range' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Start Value</label>
              <input
                type="number"
                value={rangeStart}
                onChange={(e) => setRangeStart(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Limit Value</label>
              <input
                type="number"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Pattern Typology</label>
              <select
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="seq">Sequential Bits</option>
                <option value="fib">Fibonacci Sequence</option>
                <option value="prime">Prime Digits</option>
                <option value="square">Perfect Squares</option>
              </select>
            </div>
          </div>
        )}

        {inputMethod === 'random' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Amount Density</label>
              <input
                type="number"
                value={randomCount}
                onChange={(e) => setRandomCount(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 font-mono outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Distribution Mode</label>
              <select
                value={randomDist}
                onChange={(e) => setRandomDist(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="uniform">Uniform Distribution</option>
                <option value="normal">Normal (Gaussian) Proxy</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center mb-6">
        <button
          onClick={triggerProcess}
          disabled={processing}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold uppercase tracking-widest cursor-pointer transition flex items-center gap-2"
        >
          {processing ? 'Processing...' : 'Process Batch'}
        </button>
      </div>

      {progress > 0 && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Converter Speed: {rate} ops/sec</span>
            <span>{progress}% Finished</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center sm:flex-row flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-350">
              Compilation Ledger ({results.length} conversions parsed)
            </span>
            <button
              onClick={exportCSV}
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded transition cursor-pointer"
            >
              Export Results CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-2.5 px-4 text-center">No</th>
                  <th className="py-2.5 px-4">Raw Input (Base {fromBase})</th>
                  <th className="py-2.5 px-4">Formatted Outcome (Base {toBase})</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {results.map((r) => (
                  <tr key={r.serial} className="hover:bg-slate-950/40">
                    <td className="py-2 px-4 text-center text-slate-500">{r.serial}</td>
                    <td className="py-2 px-4 text-slate-300 font-bold">{r.input}</td>
                    <td className="py-2 px-4 text-indigo-450 font-bold">{r.to}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
                        r.valid ? 'bg-emerald-950/50 text-emerald-400' : 'bg-rose-955/50 text-rose-405'
                      }`}>
                        {r.valid ? 'Valid' : 'Invalid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
