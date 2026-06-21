import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Code } from 'lucide-react';

export default function Base64View() {
  const [inputText, setInputText] = useState<string>('Welcome to DLD Lab');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [outcome, setOutcome] = useState<string>('V2VsY29tZSB0byBETEQgTGFi');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const calculateBase64 = (val: string, activeMode: 'encode' | 'decode') => {
    try {
      if (activeMode === 'encode') {
        const bytes = new TextEncoder().encode(val);
        const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
        setOutcome(btoa(binString));
        setErrorText('');
      } else {
        const binString = atob(val);
        const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
        setOutcome(new TextDecoder().decode(bytes));
        setErrorText('');
      }
    } catch {
      setErrorText('Invalid input or incorrect Base64 alignment padding.');
    }
  };

  const handleModeChange = (nextMode: 'encode' | 'decode') => {
    setMode(nextMode);
    setInputText(outcome);
    setOutcome(inputText);
    setErrorText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outcome);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Code className="w-4 h-4 text-indigo-400" />
        Base64 Binary Encoder & Decoder
      </h2>

      <p className="text-xs text-slate-400 mb-6 font-sans">
        Encode regular plaintext messages into standardized 6-bit Base64 index representations, or decode existing streams.
      </p>

      {/* Mode selectors */}
      <div className="flex border border-slate-700 rounded-lg overflow-hidden h-[42px] mb-6">
        <button
          onClick={() => handleModeChange('encode')}
          className={`flex-1 text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
          }`}
        >
          Encode Normal to Base64
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`flex-1 text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
          }`}
        >
          Decode Base64 to Normal
        </button>
      </div>

      <div className="space-y-4">
        {/* Input area */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">
            Source buffer content
          </label>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              calculateBase64(e.target.value, mode);
            }}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 transition"
            placeholder={mode === 'encode' ? 'Enter raw text to encode...' : 'Enter valid base64 stream to decode...'}
          />
        </div>

        {errorText && (
          <div className="p-3 bg-rose-950 border border-rose-800 text-rose-400 rounded-lg text-xs font-semibold">
            {errorText}
          </div>
        )}

        {/* Output area */}
        {!errorText && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 mt-4 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
              <span>Output calculation</span>
              <button
                onClick={copyToClipboard}
                className="text-indigo-400 font-bold tracking-wider flex items-center gap-1 cursor-pointer hover:text-indigo-300"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied' : 'Copy result'}
              </button>
            </div>
            <div className="text-xs font-mono text-slate-200 break-all select-all font-bold">
              {outcome || 'Waiting for conversion input...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
