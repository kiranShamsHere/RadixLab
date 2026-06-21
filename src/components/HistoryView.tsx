/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConversionRecord } from '../types';
import { Trash2, Download, Clipboard, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryViewProps {
  history: ConversionRecord[];
  onSelectRecord: (record: ConversionRecord) => void;
  onClearHistory: () => void;
  onRemoveRecord: (id: string) => void;
}

export default function HistoryView({
  history,
  onSelectRecord,
  onClearHistory,
  onRemoveRecord,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.input.toLowerCase().includes(term) ||
      item.result.toLowerCase().includes(term) ||
      item.fromBase.toString().includes(term) ||
      item.toBase.toString().includes(term)
    );
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'number_system_history.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'From Base', 'To Base', 'Input', 'Result'];
    const rows = history.map((item) => [
      item.id,
      new Date(item.timestamp).toISOString(),
      item.fromBase,
      item.toBase,
      `"${item.input.replace(/"/g, '""')}"`,
      `"${item.result.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', 'number_system_history.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-fuchsia-500" />
            Conversion History
          </h3>
          <p className="text-xs text-slate-400">Track and reuse your calculations</p>
        </div>
        {history.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300 rounded-lg transition-all"
              title="Export History as CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportJSON}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
              title="Export History as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClearHistory}
              className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/50 hover:border-rose-800 rounded-lg transition-all"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-fuchsia-500/80 focus:ring-1 focus:ring-fuchsia-500/20 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] lg:max-h-none">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No records found
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filteredHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                  layout
                  className="group bg-slate-950 border border-slate-800/80 hover:border-fuchsia-500/50 rounded-xl p-3.5 flex flex-col gap-2 relative transition-colors duration-200 cursor-pointer"
                  onClick={() => onSelectRecord(item)}
                >
                  <div className="flex justify-between items-start pr-8">
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-fuchsia-400 font-mono px-2 py-0.5 rounded-full">
                      Base {item.fromBase} → {item.toBase}
                    </span>
                  </div>
                  <div className="flex flex-col font-mono text-xs">
                    <div className="text-slate-400 truncate">
                      In: <strong className="text-slate-200">{item.input}</strong>
                    </div>
                    <div className="text-fuchsia-400 truncate mt-1">
                      Out: <strong className="text-fuchsia-300">{item.result}</strong>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecord(item.id);
                      }}
                      className="p-1.5 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
