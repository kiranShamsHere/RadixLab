import React, { useState } from 'react';
import { Calculator, Sparkles, AlertCircle } from 'lucide-react';

export default function ScientificCalculatorView() {
  const [display, setDisplay] = useState<string>('');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('rad');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const appendToDisplay = (value: string) => {
    setDisplay((prev) => prev + value);
    setErrorMsg('');
  };

  const handleClear = () => {
    setDisplay('');
    setErrorMsg('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const calculateResult = () => {
    if (!display) return;
    try {
      // Basic sanitize for safe local math eval
      const sanitized = display
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**');

      // safe eval helper
      const res = new Function(`return (${sanitized})`)();
      if (res === Infinity || res === -Infinity || isNaN(res)) {
        throw new Error('Arithmetic Anomaly');
      }
      setDisplay(Number(res.toFixed(10)).toString());
    } catch (err) {
      setErrorMsg('Error evaluating statement');
    }
  };

  const applyMathFunc = (func: string) => {
    try {
      let currentVal = parseFloat(display);
      if (isNaN(currentVal)) {
        // Parse from evaluated display as fallback
        const sanit = display.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
        currentVal = new Function(`return (${sanit})`)();
      }
      if (isNaN(currentVal)) {
        setErrorMsg('Enter operand value first');
        return;
      }

      let result = 0;
      switch (func) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin((currentVal * Math.PI) / 180) : Math.sin(currentVal);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos((currentVal * Math.PI) / 180) : Math.cos(currentVal);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan((currentVal * Math.PI) / 180) : Math.tan(currentVal);
          break;
        case 'asin':
          result = angleMode === 'deg' ? (Math.asin(currentVal) * 180) / Math.PI : Math.asin(currentVal);
          break;
        case 'acos':
          result = angleMode === 'deg' ? (Math.acos(currentVal) * 180) / Math.PI : Math.acos(currentVal);
          break;
        case 'atan':
          result = angleMode === 'deg' ? (Math.atan(currentVal) * 180) / Math.PI : Math.atan(currentVal);
          break;
        case 'ln':
          result = Math.log(currentVal);
          break;
        case 'log':
          result = Math.log10(currentVal);
          break;
        case 'sqrt':
          result = Math.sqrt(currentVal);
          break;
        case 'sqr':
          result = currentVal * currentVal;
          break;
        case 'abs':
          result = Math.abs(currentVal);
          break;
        case 'recip':
          result = 1 / currentVal;
          break;
        case 'fact':
          // factorial helper
          const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
          result = fact(Math.floor(Math.abs(currentVal)));
          break;
        default:
          return;
      }
      setDisplay(Number(result.toFixed(10)).toString());
    } catch {
      setErrorMsg('Invalid Operation context');
    }
  };

  const handleMemory = (op: string) => {
    try {
      const currentVal = parseFloat(display) || 0;
      switch (op) {
        case 'mc':
          setMemory(0);
          break;
        case 'mr':
          setDisplay(memory.toString());
          break;
        case 'm+':
          setMemory((prev) => prev + currentVal);
          break;
        case 'm-':
          setMemory((prev) => prev - currentVal);
          break;
      }
    } catch {
      setErrorMsg('Memory calculation failure');
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 sm:p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Calculator className="w-4 h-4 text-indigo-400" />
        Scientific Hardware Calculator
      </h2>

      <p className="text-xs text-slate-450 mb-6">
        Perform standard algebraic, trigonometric, and memory register actions on physical decibels.
      </p>

      {/* Angle mode and display screen */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex bg-slate-950 border border-slate-800 rounded overflow-hidden">
            <button
              onClick={() => setAngleMode('rad')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all font-bold cursor-pointer ${
                angleMode === 'rad' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rad
            </button>
            <button
              onClick={() => setAngleMode('deg')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all font-bold cursor-pointer ${
                angleMode === 'deg' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deg
            </button>
          </div>
          {memory !== 0 && (
            <span className="text-[10px] bg-indigo-950/50 border border-indigo-900 text-indigo-400 font-bold font-mono px-2 py-0.5 rounded tracking-widest">
              MEM: {memory}
            </span>
          )}
        </div>

        <input
          type="text"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-4 text-right text-lg font-mono text-slate-100 outline-none placeholder:text-slate-700"
          placeholder="0"
        />

        {errorMsg && (
          <div className="p-3 bg-rose-955 border border-rose-800 text-rose-400 rounded-lg text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-5 gap-2">
        {/* Row 1 Memory */}
        <button onClick={() => handleMemory('mc')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">MC</button>
        <button onClick={() => handleMemory('mr')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">MR</button>
        <button onClick={() => handleMemory('m+')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">M+</button>
        <button onClick={() => handleMemory('m-')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">M-</button>
        <button onClick={handleClear} className="py-2.5 bg-rose-955 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">C</button>

        {/* Row 2 Trig */}
        <button onClick={() => applyMathFunc('sin')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">sin</button>
        <button onClick={() => applyMathFunc('cos')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">cos</button>
        <button onClick={() => applyMathFunc('tan')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">tan</button>
        <button onClick={() => appendToDisplay('(')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-350 rounded-lg text-xs font-bold cursor-pointer">(</button>
        <button onClick={() => appendToDisplay(')')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-350 rounded-lg text-xs font-bold cursor-pointer">)</button>

        {/* Row 3 Inverse Trig && Log */}
        <button onClick={() => applyMathFunc('asin')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">asin</button>
        <button onClick={() => applyMathFunc('acos')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">acos</button>
        <button onClick={() => applyMathFunc('atan')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">atan</button>
        <button onClick={() => appendToDisplay('e')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-mono cursor-pointer">e</button>
        <button onClick={() => appendToDisplay('π')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-mono cursor-pointer">π</button>

        {/* Row 4 Operations */}
        <button onClick={() => applyMathFunc('ln')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">ln</button>
        <button onClick={() => appendToDisplay('7')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">7</button>
        <button onClick={() => appendToDisplay('8')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">8</button>
        <button onClick={() => appendToDisplay('9')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">9</button>
        <button onClick={() => appendToDisplay('/')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-405 rounded-lg text-sm font-bold font-mono cursor-pointer">÷</button>

        {/* Row 5 */}
        <button onClick={() => applyMathFunc('log')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">log</button>
        <button onClick={() => appendToDisplay('4')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">4</button>
        <button onClick={() => appendToDisplay('5')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">5</button>
        <button onClick={() => appendToDisplay('6')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">6</button>
        <button onClick={() => appendToDisplay('*')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-405 rounded-lg text-sm font-bold font-mono cursor-pointer">×</button>

        {/* Row 6 */}
        <button onClick={() => appendToDisplay('^')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">xʸ</button>
        <button onClick={() => appendToDisplay('1')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">1</button>
        <button onClick={() => appendToDisplay('2')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">2</button>
        <button onClick={() => appendToDisplay('3')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">3</button>
        <button onClick={() => appendToDisplay('-')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-405 rounded-lg text-sm font-bold font-mono cursor-pointer">−</button>

        {/* Row 7 */}
        <button onClick={() => applyMathFunc('sqrt')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">√</button>
        <button onClick={() => appendToDisplay('0')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">0</button>
        <button onClick={() => appendToDisplay('.')} className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-100 rounded-lg text-sm font-bold font-mono cursor-pointer">.</button>
        <button onClick={handleBackspace} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-400 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">⌫</button>
        <button onClick={() => appendToDisplay('+')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-405 rounded-lg text-sm font-bold font-mono cursor-pointer">+</button>

        {/* Row 8 Extra Science */}
        <button onClick={() => applyMathFunc('sqr')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">x²</button>
        <button onClick={() => applyMathFunc('abs')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">abs</button>
        <button onClick={() => applyMathFunc('recip')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">1/x</button>
        <button onClick={() => applyMathFunc('fact')} className="py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono cursor-pointer">x!</button>
        <button onClick={calculateResult} className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold cursor-pointer">=</button>
      </div>
    </div>
  );
}
