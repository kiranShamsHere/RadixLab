/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConversionRecord } from '../types';
import { BarChart3, TrendingUp, PieChart, Activity, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsViewProps {
  history: ConversionRecord[];
  onClearHistory: () => void;
}

export default function AnalyticsView({ history, onClearHistory }: AnalyticsViewProps) {
  // Compute analytics from actual history
  const totalConversions = history.length;

  const baseCounts: Record<number, number> = {};
  const targetCounts: Record<number, number> = {};
  
  history.forEach((h) => {
    baseCounts[h.fromBase] = (baseCounts[h.fromBase] || 0) + 1;
    targetCounts[h.toBase] = (targetCounts[h.toBase] || 0) + 1;
  });

  const uniqueBasesUsed = Object.keys(baseCounts).length;

  // Find most frequent source/target bases
  let topSourceBase = 'N/A';
  let maxSourceCount = 0;
  Object.entries(baseCounts).forEach(([b, count]) => {
    if (count > maxSourceCount) {
      maxSourceCount = count;
      topSourceBase = `Base ${b}`;
    }
  });

  let topTargetBase = 'N/A';
  let maxTargetCount = 0;
  Object.entries(targetCounts).forEach(([b, count]) => {
    if (count > maxTargetCount) {
      maxTargetCount = count;
      topTargetBase = `Base ${b}`;
    }
  });

  // Calculate base usage percentages for charts
  const baseColors: Record<string, string> = {
    '2': '#a855f7',   // Binary (Fuchsia)
    '8': '#2563eb',   // Octal (Blue)
    '10': '#3b82f6',  // Decimal (Light Blue)
    '16': '#10b981',  // Hex (Emerald)
    'custom': '#f59e0b' // Custom base (Amber)
  };

  const getBaseColor = (base: string) => baseColors[base] || baseColors['custom'];

  // Donut chart segments calculation
  const sourceBasesDistribution = Object.entries(baseCounts).map(([base, count]) => ({
    label: `Base ${base}`,
    count,
    percentage: totalConversions > 0 ? (count / totalConversions) * 100 : 0,
    color: getBaseColor(base),
  }));

  // Bar chart historical calculations (Group by date over last 7 conversions as visual mockup if empty, otherwise real data)
  const recentConversions = [...history].slice(0, 7).reverse();

  return (
    <div className="space-y-6">
      {/* Upper header summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            RadixLab Diagnostic Analytics & Data Visualization
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry and pattern breakdown computed from conversion logs
          </p>
        </div>
        {totalConversions > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3.5 py-1.5 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 border border-rose-900/40 hover:border-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            Reset Metrics
          </button>
        )}
      </div>

      {/* 4 Multi-metric bento cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-indigo-500/20">
            <Activity className="w-12 h-12 stroke-[1.5]" />
          </div>
          <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Total Operations</span>
          <div className="text-3xl font-black text-slate-100 mt-2 font-mono">{totalConversions}</div>
          <div className="text-[10px] text-slate-400 mt-1">Conversions executed in sandbox</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-fuchsia-500/20">
            <Cpu className="w-12 h-12 stroke-[1.5]" />
          </div>
          <span className="text-[10px] text-fuchsia-400 uppercase tracking-widest font-bold">Unique Bases Logged</span>
          <div className="text-3xl font-black text-slate-100 mt-2 font-mono">{uniqueBasesUsed}</div>
          <div className="text-[10px] text-slate-400 mt-1">Distinct radix configurations tested</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-emerald-500/20">
            <Sparkles className="w-12 h-12 stroke-[1.5]" />
          </div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Top Source Base</span>
          <div className="text-2xl font-black text-slate-100 mt-3 font-mono">{topSourceBase}</div>
          <div className="text-[10px] text-slate-400 mt-1">Highest source radix activity</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-amber-500/20">
            <TrendingUp className="w-12 h-12 stroke-[1.5]" />
          </div>
          <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Top Target Base</span>
          <div className="text-2xl font-black text-slate-100 mt-3 font-mono">{topTargetBase}</div>
          <div className="text-[10px] text-slate-400 mt-1">Highest target radix conversion</div>
        </motion.div>
      </div>

      {totalConversions === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-300">No telemetry logs found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Complete a few base conversions in the Base Converter module to populate interactive telemetry maps and structural statistics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                <PieChart className="w-4 h-4 text-fuchsia-400" />
                Source Base Frequency
              </h3>
              <p className="text-xs text-slate-500">Distribution proportion of bases utilized</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6">
              {/* Native SVG responsive Donut Chart */}
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  {(() => {
                    let cumulativePercentage = 0;
                    return sourceBasesDistribution.map((item, idx) => {
                      const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                      const strokeDashoffset = 100 - cumulativePercentage + 25; // with offset adjustment
                      cumulativePercentage += item.percentage;
                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth="10"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Bases</span>
                  <span className="text-xl font-extrabold text-slate-100 font-mono">
                    {sourceBasesDistribution.length}
                  </span>
                </div>
              </div>

              {/* Legend indicators */}
              <div className="space-y-2 mt-4 sm:mt-0">
                {sourceBasesDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 font-medium font-mono">{item.label}:</span>
                    <span className="text-slate-400 font-mono">
                      {item.count} ({Math.round(item.percentage)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sparkline & Recent Conversions timeline analyzer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Recent Base Conversions Path
              </h3>
              <p className="text-xs text-slate-500">Mapping scale and paths of recent operations</p>
            </div>

            <div className="py-6 flex flex-col justify-end flex-grow">
              {/* Native responsive Area Sparkline graph */}
              <div className="h-28 w-full relative mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="5" x2="100" y2="5" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="15" x2="100" y2="15" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />

                  {/* Polyline area path */}
                  {recentConversions.length > 1 ? (
                    (() => {
                      const points = recentConversions.map((item, idx) => {
                        const x = (idx / (recentConversions.length - 1)) * 100;
                        // Map base ranges from 2 to 36 safely onto visual range (25 to 5 px height)
                        const rawBase = Math.min(36, Math.max(2, item.fromBase));
                        const y = 30 - (((rawBase - 2) / 34) * 24 + 3);
                        return { x, y };
                      });
                      
                      const pathStr = points.map(p => `${p.x},${p.y}`).join(' ');
                      const areaStr = `0,30 ${pathStr} 100,30`;

                      return (
                        <>
                          <polygon points={areaStr} fill="url(#areaGradient)" />
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            points={pathStr}
                          />
                          {/* Point circular connectors */}
                          {points.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r="1.8"
                              fill="#1d4ed8"
                              stroke="#60a5fa"
                              strokeWidth="0.6"
                            />
                          ))}
                        </>
                      );
                    })()
                  ) : (
                    <text x="50" y="15" fill="#64748b" fontSize="4" textAnchor="middle">
                      Add more conversions to trace path chart
                    </text>
                  )}
                </svg>
              </div>

              {/* Labels for points */}
              <div className="flex justify-between items-center text-[9px] font-mono font-semibold text-slate-500 uppercase px-2">
                <span>Older Conversions</span>
                <span>Latest Run</span>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-800/60 pt-3">
                <div className="text-[10px] text-slate-400">
                  * Live sparkline visualizes the base values in sequence (2 to 36 scale).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
