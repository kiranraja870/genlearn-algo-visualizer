'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, RefreshCw, Terminal, ChevronRight, Hash } from 'lucide-react';

// Utility for delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SearchVisualizer() {
  // State
  const [array, setArray] = useState<number[]>([4, 8, 12, 15, 18, 23, 31, 42, 55, 67, 71, 89]);
  const [target, setTarget] = useState<number>(23);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  
  // Binary Search specific states
  const [lowIndex, setLowIndex] = useState<number | null>(null);
  const [highIndex, setHighIndex] = useState<number | null>(null);
  
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Reset Function
  const resetVisualization = () => {
    setIsSearching(false);
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setLogs(['Ready to search...', `Target is set to ${target}`]);
  };

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  // --- LINEAR SEARCH ALGORITHM ---
  const startLinearSearch = async () => {
    if (isSearching) return;
    resetVisualization();
    setIsSearching(true);
    addLog('🚀 Starting Linear Search...');
    addLog(`Scanning array for target: ${target}`);

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      addLog(`Checking index [${i}]: Value ${array[i]}`);
      
      await sleep(600); // Animation delay

      if (array[i] === target) {
        setFoundIndex(i);
        addLog(`✅ Target ${target} found at index ${i}!`);
        setIsSearching(false);
        return;
      }
    }

    addLog(`❌ Target ${target} not found in the array.`);
    setIsSearching(false);
    setCurrentIndex(null);
  };

  // --- BINARY SEARCH ALGORITHM ---
  const startBinarySearch = async () => {
    if (isSearching) return;
    resetVisualization();
    setIsSearching(true);
    addLog('🚀 Starting Binary Search...');
    addLog('ℹ️ Array is sorted. Dividing and conquering.');

    let left = 0;
    let right = array.length - 1;

    setLowIndex(left);
    setHighIndex(right);

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      setLowIndex(left);
      setHighIndex(right);
      
      addLog(`Range: [${left} - ${right}], Mid: [${mid}] -> Value: ${array[mid]}`);
      
      await sleep(1000); // Animation delay

      if (array[mid] === target) {
        setFoundIndex(mid);
        addLog(`✅ Target ${target} found at index ${mid}!`);
        setIsSearching(false);
        return;
      }

      if (array[mid] < target) {
        addLog(`⬆️ ${array[mid]} is smaller than ${target}. Moving Right.`);
        left = mid + 1;
      } else {
        addLog(`⬇️ ${array[mid]} is larger than ${target}. Moving Left.`);
        right = mid - 1;
      }
    }

    addLog(`❌ Target ${target} not found.`);
    setIsSearching(false);
    setCurrentIndex(null);
    setLowIndex(null);
    setHighIndex(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center selection:bg-cyan-500/30">
      
      {/* Header */}
      <div className="max-w-4xl w-full mb-8 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
          Linear And Binary Search
        </h1>
        <p className="text-neutral-400 text-sm md:text-base">
          Visualizing Search Algorithms with Next.js & Framer Motion
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="max-w-4xl w-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="number" 
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
                  resetVisualization();
                }}
                disabled={isSearching}
                className="bg-neutral-950 border border-neutral-700 text-cyan-400 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-32 font-mono transition-all disabled:opacity-50"
              />
              <span className="absolute -top-2.5 left-3 bg-neutral-900 px-1 text-xs text-neutral-500">Target</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startLinearSearch}
              disabled={isSearching}
              className="flex items-center gap-2 px-5 py-2 bg-neutral-800 hover:bg-neutral-700 hover:text-cyan-400 text-neutral-300 rounded-lg transition-all border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Search className="w-4 h-4" /> Linear
            </button>
            <button
              onClick={startBinarySearch}
              disabled={isSearching}
              className="flex items-center gap-2 px-5 py-2 bg-neutral-800 hover:bg-neutral-700 hover:text-emerald-400 text-neutral-300 rounded-lg transition-all border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Play className="w-4 h-4" /> Binary
            </button>
            <button
              onClick={resetVisualization}
              disabled={isSearching}
              className="p-2 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-lg transition-all border border-neutral-700 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Array Visualization */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 min-h-[120px] items-center">
          <AnimatePresence>
            {array.map((num, idx) => {
              // Determine state of the box
              const isFound = idx === foundIndex;
              const isCurrent = idx === currentIndex;
              
              // Binary Search Specific Highlighting
              const isDimmed = (lowIndex !== null && highIndex !== null) && (idx < lowIndex || idx > highIndex);
              const isLow = idx === lowIndex;
              const isHigh = idx === highIndex;

              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: isFound || isCurrent ? 1.1 : 1, 
                    opacity: isDimmed ? 0.2 : 1,
                    borderColor: isFound 
                      ? '#10b981' // Green
                      : isCurrent 
                        ? '#06b6d4' // Cyan
                        : '#404040' // Neutral
                  }}
                  className={`
                    relative w-12 h-14 md:w-16 md:h-20 flex items-center justify-center 
                    rounded-lg border-2 bg-neutral-800/80 backdrop-blur-sm
                    font-mono text-lg md:text-2xl font-bold shadow-lg transition-colors
                    ${isFound ? 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20' : ''}
                    ${isCurrent ? 'bg-cyan-500/20 text-cyan-400 shadow-cyan-500/20' : 'text-neutral-300'}
                  `}
                >
                  {num}
                  
                  {/* Indicators for Indices */}
                  <div className="absolute -bottom-6 text-[10px] text-neutral-600 font-sans">
                    {idx}
                  </div>

                  {/* Binary Search Pointers */}
                  {isLow && !isFound && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 text-xs text-amber-500 font-bold"
                    >
                      L
                    </motion.div>
                  )}
                  {isHigh && !isFound && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 text-xs text-amber-500 font-bold"
                    >
                      R
                    </motion.div>
                  )}
                  {isCurrent && !isFound && (
                    <motion.div 
                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                       className="absolute -top-8 text-xs text-cyan-400 font-bold"
                    >
                      Mid
                    </motion.div>
                  )}

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Logs Terminal */}
        <div className="bg-black rounded-xl border border-neutral-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border-b border-neutral-800">
            <Terminal className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-mono text-neutral-400">Activity Log</span>
          </div>
          <div className="h-48 overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {logs.length === 0 && (
              <div className="text-neutral-600 italic">Waiting to start...</div>
            )}
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2"
              >
                <ChevronRight className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                <span className={
                  log.includes('✅') ? 'text-emerald-400' :
                  log.includes('❌') ? 'text-red-400' :
                  log.includes('🚀') ? 'text-amber-400' :
                  'text-neutral-300'
                }>
                  {log}
                </span>
              </motion.div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

    </div>
  );
}