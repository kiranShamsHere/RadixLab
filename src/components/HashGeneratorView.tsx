import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Sparkles } from 'lucide-react';

export default function HashGeneratorView() {
  const [inputText, setInputText] = useState<string>('DLD Lab Station');
  const [copiedAlg, setCopiedAlg] = useState<string | null>(null);

  const [sha1Value, setSha1Value] = useState<string>('');
  const [sha256Value, setSha256Value] = useState<string>('');
  const [sha512Value, setSha512Value] = useState<string>('');

  // Use web crypto API for real hash calculations (fully offline & server-side safe)
  const calculateHashes = async (text: string) => {
    try {
      const msgBuffer = new TextEncoder().encode(text);

      const hashBuffer1 = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray1 = Array.from(new Uint8Array(hashBuffer1));
      setSha1Value(hashArray1.map(b => b.toString(16).padStart(2, '0')).join(''));

      const hashBuffer256 = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      setSha256Value(hashArray256.map(b => b.toString(16).padStart(2, '0')).join(''));

      const hashBuffer512 = await crypto.subtle.digest('SHA-512', msgBuffer);
      const hashArray512 = Array.from(new Uint8Array(hashBuffer512));
      setSha512Value(hashArray512.map(b => b.toString(16).padStart(2, '0')).join(''));
    } catch (e) {
      // safe fallback
    }
  };

  useEffect(() => {
    calculateHashes(inputText);
  }, [inputText]);

  const copyToClipboard = (text: string, alg: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAlg(alg);
    setTimeout(() => setCopiedAlg(null), 1000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4 text-indigo-400" />
        Cryptographic Hash Generator
      </h2>

      <p className="text-xs text-slate-400 mb-6 font-sans">
        Hash raw text lines locally into cryptographically secure digest signatures using native browser standards.
      </p>

      <div className="space-y-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Plaintext Input Buffer</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500 transition"
            placeholder="Type your message here to compute live hashes..."
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* SHA-256 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">SHA-256 Digest</span>
            <button
              onClick={() => copyToClipboard(sha256Value, 'sha256')}
              className="text-[10px] text-slate-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedAlg === 'sha256' ? 'Copied Hash' : 'Copy signature'}
            </button>
          </div>
          <div className="text-xs text-slate-300 break-all select-all font-bold">
            {sha256Value || 'Computing...'}
          </div>
        </div>

        {/* SHA-1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">SHA-1 Digest</span>
            <button
              onClick={() => copyToClipboard(sha1Value, 'sha1')}
              className="text-[10px] text-slate-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedAlg === 'sha1' ? 'Copied Hash' : 'Copy signature'}
            </button>
          </div>
          <div className="text-xs text-slate-300 break-all select-all font-bold">
            {sha1Value || 'Computing...'}
          </div>
        </div>

        {/* SHA-512 */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">SHA-512 Signature</span>
            <button
              onClick={() => copyToClipboard(sha512Value, 'sha512')}
              className="text-[10px] text-slate-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedAlg === 'sha512' ? 'Copied Hash' : 'Copy signature'}
            </button>
          </div>
          <div className="text-xs text-slate-300 break-all select-all font-bold">
            {sha512Value || 'Computing...'}
          </div>
        </div>
      </div>
    </div>
  );
}
