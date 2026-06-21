import React, { useState, useEffect } from 'react';
import { Palette, Copy, Sparkles } from 'lucide-react';

export default function ColorConverterView() {
  const [hex, setHex] = useState<string>('#6366F1');
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number }>({ h: 239, s: 84, l: 67 });
  const [cmyk, setCmyk] = useState<{ c: number; m: number; y: number; k: number }>({ c: 59, m: 58, y: 0, k: 5 });

  const [lastUpdated, setLastUpdated] = useState<'hex' | 'rgb' | 'hsl' | 'cmyk'>('hex');
  const [copied, setCopied] = useState<string | null>(null);

  // Hex to RGB
  const hexToRgb = (hexStr: string) => {
    let clean = hexStr.replace(/^#/, '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const val = parseInt(clean, 16);
    return {
      r: (val >> 16) & 255,
      g: (val >> 8) & 255,
      b: val & 255,
    };
  };

  // RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    const componentToHex = (c: number) => {
      const hexVal = Math.max(0, Math.min(255, c)).toString(16).toUpperCase();
      return hexVal.length === 1 ? '0' + hexVal : hexVal;
    };
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r = l;
    let g = l;
    let b = l;

    if (s !== 0) {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rL = r / 255;
    const gL = g / 255;
    const bL = b / 255;
    const k = 1 - Math.max(rL, gL, bL);
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    const c = (1 - rL - k) / (1 - k);
    const m = (1 - gL - k) / (1 - k);
    const y = (1 - bL - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  // CMYK to RGB
  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    };
  };

  // Run synchronization
  useEffect(() => {
    if (lastUpdated === 'hex') {
      try {
        const rgbVals = hexToRgb(hex);
        setRgb(rgbVals);
        setHsl(rgbToHsl(rgbVals.r, rgbVals.g, rgbVals.b));
        setCmyk(rgbToCmyk(rgbVals.r, rgbVals.g, rgbVals.b));
      } catch {
        // Safe skip invalid input
      }
    }
  }, [hex]);

  const triggerColorUpdate = (source: 'rgb' | 'hsl' | 'cmyk', updatedProps: any) => {
    setLastUpdated(source);
    if (source === 'rgb') {
      const mergedRgb = { ...rgb, ...updatedProps };
      setRgb(mergedRgb);
      const nextHex = rgbToHex(mergedRgb.r, mergedRgb.g, mergedRgb.b);
      setHex(nextHex);
      setHsl(rgbToHsl(mergedRgb.r, mergedRgb.g, mergedRgb.b));
      setCmyk(rgbToCmyk(mergedRgb.r, mergedRgb.g, mergedRgb.b));
    } else if (source === 'hsl') {
      const mergedHsl = { ...hsl, ...updatedProps };
      setHsl(mergedHsl);
      const rgbVals = hslToRgb(mergedHsl.h, mergedHsl.s, mergedHsl.l);
      setRgb(rgbVals);
      setHex(rgbToHex(rgbVals.r, rgbVals.g, rgbVals.b));
      setCmyk(rgbToCmyk(rgbVals.r, rgbVals.g, rgbVals.b));
    } else if (source === 'cmyk') {
      const mergedCmyk = { ...cmyk, ...updatedProps };
      setCmyk(mergedCmyk);
      const rgbVals = cmykToRgb(mergedCmyk.c, mergedCmyk.m, mergedCmyk.y, mergedCmyk.k);
      setRgb(rgbVals);
      setHex(rgbToHex(rgbVals.r, rgbVals.g, rgbVals.b));
      setHsl(rgbToHsl(rgbVals.r, rgbVals.g, rgbVals.b));
    }
  };

  const copyString = (str: string, label: string) => {
    navigator.clipboard.writeText(str);
    setCopied(label);
    setTimeout(() => setCopied(null), 1000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Palette className="w-4 h-4 text-indigo-400" />
        Developer Color Code Converter
      </h2>

      <p className="text-xs text-slate-400 mb-6 font-sans">
        Seamlessly translate visual colors between hex, digital RGB bit ranges, hardware CMYK percentages, and HSL modes.
      </p>

      {/* Grid containing preview box on left, fields on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Color preview box */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-lg h-44">
          <div
            className="w-24 h-24 rounded-full shadow-lg border border-slate-700 mb-3 transition-colors duration-200"
            style={{ backgroundColor: hex }}
          />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
            {hex}
          </span>
        </div>

        {/* Inputs list */}
        <div className="md:col-span-8 space-y-4">
          {/* HEX code point */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>HEX Color Code</span>
              <button
                onClick={() => copyString(hex, 'hex')}
                className="text-indigo-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300"
              >
                <Copy className="w-3 h-3" />
                {copied === 'hex' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => {
                setLastUpdated('hex');
                setHex(e.target.value);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:border-indigo-500"
              placeholder="#FFFFFF"
            />
          </div>

          {/* RGB color points */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>RGB Values</span>
              <button
                onClick={() => copyString(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                className="text-indigo-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300"
              >
                <Copy className="w-3 h-3" />
                {copied === 'rgb' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">R (Red)</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.r}
                  onChange={(e) => triggerColorUpdate('rgb', { r: parseInt(e.target.value) || 0 })}
                  className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg py-2 text-xs font-mono text-slate-201 text-slate-100"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">G (Green)</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.g}
                  onChange={(e) => triggerColorUpdate('rgb', { g: parseInt(e.target.value) || 0 })}
                  className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg py-2 text-xs font-mono text-slate-201 text-slate-100"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">B (Blue)</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.b}
                  onChange={(e) => triggerColorUpdate('rgb', { b: parseInt(e.target.value) || 0 })}
                  className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg py-2 text-xs font-mono text-slate-201 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* HSL sliders */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 font-mono">
              <span>HSL Mode</span>
              <button
                onClick={() => copyString(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                className="text-indigo-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300"
              >
                <Copy className="w-3 h-3" />
                {copied === 'hsl' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">H (Hue)</span>
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => triggerColorUpdate('hsl', { h: parseInt(e.target.value) || 0 })}
                  className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg py-2 text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">S (Sat %)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => triggerColorUpdate('hsl', { s: parseInt(e.target.value) || 0 })}
                  className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg py-2 text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">L (Light %)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => triggerColorUpdate('hsl', { l: parseInt(e.target.value) || 0 })}
                  className="w-full text-center bg-slate-950 border border-slate-700 rounded-lg py-2 text-xs font-mono text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
