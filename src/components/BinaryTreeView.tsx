import React, { useState } from 'react';
import { GitCommit, Sparkles } from 'lucide-react';

interface TreeNode {
  value: number;
  quotient?: number;
  remainder?: number;
  step?: string;
  left?: TreeNode;
  right?: TreeNode;
}

export default function BinaryTreeView() {
  const [val, setVal] = useState<number>(42);

  // Generates recursion-tree of divisions by 2 (the standard binary extraction path)
  const buildDecompositionTree = (n: number): TreeNode => {
    if (n <= 0) {
      return { value: 0, remainder: 0, quotient: 0, step: '0 / 2 = 0 R 0' };
    }
    const rem = n % 2;
    const quotient = Math.floor(n / 2);
    const step = `${n} / 2 = ${quotient} R ${rem}`;

    const node: TreeNode = {
      value: n,
      remainder: rem,
      quotient: quotient,
      step: step,
    };

    if (quotient > 0) {
      node.left = { value: quotient, step: `Quotient: ${quotient}` };
      node.right = { value: rem, step: `Remainder (Bit): ${rem}` };
    }
    return node;
  };

  const renderVisualNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    if (!node) return null;

    return (
      <div className="flex flex-col items-center" key={`${depth}-${node.value}`}>
        {/* Node bubble */}
        <div className={`p-3 border rounded-lg font-mono text-center shadow-sm w-44 transition ${
          node.remainder !== undefined
            ? 'bg-slate-950 border-slate-700'
            : 'bg-indigo-950/20 border-indigo-900/50'
        }`}>
          {node.remainder !== undefined ? (
            <>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Value {node.value}</div>
              <div className="text-xs font-bold text-slate-200">{node.step}</div>
              <div className="text-[9px] mt-1 text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/40 px-1 py-0.5 rounded inline-block">
                Bit = {node.remainder}
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400 font-bold">{node.step}</div>
          )}
        </div>

        {/* Children division lines */}
        {(node.left || node.right) && (
          <div className="flex flex-col items-center mt-4 w-full">
            {/* Draw brief connecting branch indicators */}
            <div className="h-4 w-0.5 bg-slate-700" />
            <div className="flex justify-between items-start gap-8 w-full max-w-lg mt-2">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-mono font-bold uppercase block mb-1">Left (Quotient)</span>
                {node.left && renderVisualNode(node.left, depth + 1)}
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] text-emerald-500 font-mono font-bold uppercase block mb-1">Right (Bit Node)</span>
                {node.right && renderVisualNode(node.right, depth + 1)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const rootNode = buildDecompositionTree(Math.max(0, Math.min(1000, val)));

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl relative overflow-hidden">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <GitCommit className="w-4 h-4 text-indigo-400" />
        Binary Division Tree Converter
      </h2>

      <p className="text-xs text-slate-450 mb-6 font-sans">
        Observe the mathematical remainder division sequence that translates decimal bases to bits, illustrated as an active recursion nodes layout.
      </p>

      {/* Inputs panel */}
      <div className="space-y-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400">Decimal seed value (0 - 100). Keep small for clean visual layouts</label>
          <input
            type="number"
            min={0}
            max={100}
            value={val}
            onChange={(e) => setVal(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-505 focus:border-indigo-500 transition font-mono"
            placeholder="e.g. 42"
          />
        </div>
      </div>

      {/* Visual Workspace Frame */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 overflow-x-auto min-h-[300px] flex items-start justify-center">
        {renderVisualNode(rootNode)}
      </div>
    </div>
  );
}
