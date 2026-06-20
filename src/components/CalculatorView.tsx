/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeftRight, Check, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { validateInput, convertBase } from '../utils/converter';

type Operator = '+' | '-' | '*' | '/' | 'AND' | 'OR' | 'XOR' | '<<' | '>>';

export default function CalculatorView() {
  const [calcBase, setCalcBase] = React.useState<number>(10);
  const [operand1, setOperand1] = React.useState<string>('');
  const [operand2, setOperand2] = React.useState<string>('');
  const [operator, setOperator] = React.useState<Operator>('+');

  const [result, setResult] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const isValid1 = React.useMemo(() => !operand1 || validateInput(operand1, calcBase), [operand1, calcBase]);
  const isValid2 = React.useMemo(() => !operand2 || validateInput(operand2, calcBase), [operand2, calcBase]);

  const handleCalculate = () => {
    setErrorMessage('');
    setResult('');

    if (!operand1 || !operand2) {
      setErrorMessage('Both operands must be populated.');
      return;
    }

    if (!validateInput(operand1, calcBase) || !validateInput(operand2, calcBase)) {
      setErrorMessage('One or both operands contain invalid characters for chosen base.');
      return;
    }

    try {
      // 1. Convert operands to base-10 integers
      const dec1Str = convertBase(operand1, calcBase, 10).split('.')[0];
      const dec2Str = convertBase(operand2, calcBase, 10).split('.')[0];

      const val1 = parseInt(dec1Str, 10);
      const val2 = parseInt(dec2Str, 10);

      let mathResult = 0;
      switch (operator) {
        case '+':
          mathResult = val1 + val2;
          break;
        case '-':
          mathResult = val1 - val2;
          break;
        case '*':
          mathResult = val1 * val2;
          break;
        case '/':
          if (val2 === 0) {
            setErrorMessage('Division by zero is undefined.');
            return;
          }
          mathResult = Math.floor(val1 / val2);
          break;
        case 'AND':
          mathResult = val1 & val2;
          break;
        case 'OR':
          mathResult = val1 | val2;
          break;
        case 'XOR':
          mathResult = val1 ^ val2;
          break;
        case '<<':
          mathResult = val1 << val2;
          break;
        case '>>':
          mathResult = val1 >> val2;
          break;
        default:
          break;
      }

      // 2. Convert base-10 mathResult back to chosen base
      let formattedResult = mathResult.toString(calcBase).toUpperCase();
      // Handle negative answers gracefully
      if (mathResult < 0) {
        const absVal = Math.abs(mathResult);
        formattedResult = '-' + absVal.toString(calcBase).toUpperCase();
      }

      setResult(formattedResult);
    } catch {
      setErrorMessage('Calculation failed. Ensure numbers remain within standard integer limits.');
    }
  };

  // Run automatically on input change as well
  React.useEffect(() => {
    if (operand1 && operand2 && isValid1 && isValid2) {
      handleCalculate();
    } else {
      setResult('');
      setErrorMessage('');
    }
  }, [operand1, operand2, operator, calcBase, isValid1, isValid2]);

  // Results translated across auxiliary bases
  const allBasesSummary = React.useMemo(() => {
    if (!result || errorMessage) return [];
    try {
      return [
        { name: 'Binary', value: convertBase(result, calcBase, 2) },
        { name: 'Octal', value: convertBase(result, calcBase, 8) },
        { name: 'Decimal', value: convertBase(result, calcBase, 10) },
        { name: 'Hexadecimal', value: convertBase(result, calcBase, 16) },
      ];
    } catch {
      return [];
    }
  }, [result, calcBase, errorMessage]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Cpu className="w-4 h-4 text-indigo-400" />
        Advanced Base Arithmetic Calculator
      </h2>
      <p className="text-xs text-slate-450 mb-6">
        Perform standard arithmetic and logical bitwise operations in Binary, Octal, Decimal, or Hexadecimal.
      </p>

      {/* Select active calculations base */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 col-span-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Calculation Base</label>
          <select
            value={calcBase}
            onChange={(e) => {
              setCalcBase(parseInt(e.target.value));
              setOperand1('');
              setOperand2('');
              setResult('');
              setErrorMessage('');
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none text-xs font-semibold text-slate-200 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="2">Binary (Base 2)</option>
            <option value="8">Octal (Base 8)</option>
            <option value="10">Decimal (Base 10)</option>
            <option value="16">Hexadecimal (Base 16)</option>
          </select>
        </div>
      </div>

      {/* Operands layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mb-6">
        <div className="md:col-span-5 space-y-2">
          <div className="flex justify-between">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Operand 1</label>
            {!isValid1 && (
              <span className="text-[9px] uppercase tracking-wider font-bold text-rose-450 px-2 py-0.5 bg-rose-955 rounded">
                Invalid
              </span>
            )}
          </div>
          <input
            type="text"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-base font-mono text-slate-100 placeholder:text-slate-700 outline-none transition"
            placeholder={`e.g., ${calcBase === 10 ? '42' : calcBase === 16 ? '2A' : '101010'}`}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex justify-center">Operator</label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as Operator)}
            className="w-full text-center bg-slate-950 font-bold border border-slate-700 rounded-lg px-3 py-3 outline-none text-xs text-indigo-400 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
            <option value="/">÷</option>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="XOR">XOR</option>
            <option value="<<">&lt;&lt; (L-Shift)</option>
            <option value=">>">&gt;&gt; (R-Shift)</option>
          </select>
        </div>

        <div className="md:col-span-5 space-y-2">
          <div className="flex justify-between">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Operand 2</label>
            {!isValid2 && (
              <span className="text-[9px] uppercase tracking-wider font-bold text-rose-450 px-2 py-0.5 bg-rose-955 rounded">
                Invalid
              </span>
            )}
          </div>
          <input
            type="text"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-base font-mono text-slate-100 placeholder:text-slate-700 outline-none transition"
            placeholder={`e.g., ${calcBase === 10 ? '15' : calcBase === 16 ? 'F' : '1111'}`}
          />
        </div>
      </div>

      {calcBase === 2 && (operator === '<<' || operator === '>>') && (
        <p className="text-[11px] text-amber-500 italic mb-4">
          Note: Shift operands are parsed as base-10 magnitudes to control shifting.
        </p>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-400 rounded-lg text-xs flex items-center gap-2 mb-6 font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {result && !errorMessage && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Result (Base {calcBase})</span>
            <div className="text-xl font-bold font-mono text-indigo-400 break-all select-all">
              {result}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-[10px] uppercase tracking-wider font-bold text-slate-350 mb-3">All base conversions for result</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allBasesSummary.map((base) => {
                let colorClass = 'text-slate-200';
                if (base.name === 'Binary') colorClass = 'text-emerald-400';
                else if (base.name === 'Octal') colorClass = 'text-sky-400';
                else if (base.name === 'Hexadecimal') colorClass = 'text-amber-400';

                return (
                  <div
                    key={base.name}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col font-mono"
                  >
                    <span className="text-[10px] text-slate-500 font-semibold">{base.name}</span>
                    <span className={`text-xs mt-1 font-bold break-all ${colorClass}`}>{base.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
