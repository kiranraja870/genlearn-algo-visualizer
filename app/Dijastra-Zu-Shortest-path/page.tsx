"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Navigation, Info, Building2, Car, Clock, Sparkles } from 'lucide-react';

/**
 * --- DATA STRUCTURES ---
 */

// 1. Campus Nodes with visual coordinates (0-100 scale for SVG map)
type Campus = {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
};

const CAMPUSES: Record<string, Campus> = {
  north: { id: "north", name: "North Nazimabad Campus", x: 40, y: 20, description: "Block-B, North Nazimabad" },
  clifton: { id: "clifton", name: "Clifton Campus", x: 45, y: 80, description: "Block 6, Shahrah-e-Ghalib" },
  boat_basin: { id: "boat_basin", name: "Boat Basin Campus", x: 35, y: 85, description: "Khayaban-e-Saadi" },
  kemari: { id: "kemari", name: "Kemari Campus", x: 20, y: 82, description: "KPT Hospital Area" },
  korangi: { id: "korangi", name: "Korangi Creek (Law)", x: 70, y: 88, description: "Korangi Creek Area" },
  link_road: { id: "link_road", name: "Education City (Link Road)", x: 90, y: 15, description: "Gadap Town, Link Road" },
};

// 2. The Weighted Graph (Distances in KM)
const GRAPH: Record<string, Record<string, number>> = {
  north: { clifton: 18, link_road: 35, kemari: 22 },
  clifton: { north: 18, boat_basin: 3, kemari: 12, korangi: 14 },
  boat_basin: { clifton: 3, kemari: 10 },
  kemari: { boat_basin: 10, clifton: 12, north: 22 },
  korangi: { clifton: 14, link_road: 28 },
  link_road: { north: 35, korangi: 28 },
};

/**
 * --- ALGORITHM ---
 */
const calculateDijkstra = (startNode: string, endNode: string) => {
  if (!startNode || !endNode || startNode === endNode) return null;

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const nodes = Object.keys(CAMPUSES);

  // Initialize
  nodes.forEach(node => {
    distances[node] = node === startNode ? 0 : Infinity;
    previous[node] = null;
  });

  const unvisited = new Set(nodes);

  while (unvisited.size > 0) {
    let closestNode: string | null = null;
    let shortestDistance = Infinity;

    unvisited.forEach(node => {
      if (distances[node] < shortestDistance) {
        shortestDistance = distances[node];
        closestNode = node;
      }
    });

    if (closestNode === null || distances[closestNode] === Infinity) break;
    if (closestNode === endNode) break;

    unvisited.delete(closestNode);
    visited.add(closestNode);

    const neighbors = GRAPH[closestNode] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      if (visited.has(neighbor)) continue;
      
      const newDist = distances[closestNode] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = closestNode;
      }
    }
  }

  const path: string[] = [];
  let current: string | null = endNode;
  
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path[0] !== startNode) return null;

  return {
    distance: distances[endNode],
    path: path
  };
};

/**
 * --- COMPONENTS ---
 */

export default function ZiauddinRoutePlanner() {
  const [start, setStart] = useState<string>("north");
  const [end, setEnd] = useState<string>("link_road");
  const [result, setResult] = useState<{ distance: number, path: string[] } | null>(null);

  useEffect(() => {
    const res = calculateDijkstra(start, end);
    setResult(res);
  }, [start, end]);

  const estimatedTime = result ? Math.round((result.distance / 40) * 60) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Navbar */}
      <header className="bg-[#0a0a0a] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.5)]">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              ZU NAVIGATOR <span className="text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-700">AI CORE</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">INTELLIGENT ROUTING SYSTEM</p>
          </div>
        </div>
        <div className="text-sm text-slate-400 hidden sm:flex items-center gap-2 font-medium bg-[#111] px-4 py-1.5 rounded-full border border-slate-800">
           <Sparkles className="w-3 h-3 text-cyan-400" />
           Powered by Dijkstra Algorithm
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Controls & Results */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Controls Card */}
          <div className="bg-[#0f0f0f] rounded-2xl shadow-2xl border border-slate-800 p-6 relative overflow-hidden group">
            {/* Ambient glow effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-blue-600/20"></div>
            
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Navigation className="w-5 h-5 text-cyan-500" />
              Route Configuration
            </h2>
            
            <div className="space-y-5">
              {/* Start Node */}
              <div className="relative">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5 block ml-1">Origin</label>
                <div className="relative group/input">
                    <div className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <div className="absolute left-4 top-6 w-0.5 h-6 bg-slate-700"></div>
                    <select 
                    value={start} 
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-slate-700 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-medium text-slate-200 appearance-none cursor-pointer hover:bg-[#222]"
                    >
                    {Object.values(CAMPUSES).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    </select>
                </div>
              </div>

              {/* End Node */}
              <div className="relative">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5 block ml-1">Destination</label>
                <div className="relative group/input">
                    <div className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                    <select 
                    value={end} 
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-slate-700 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-medium text-slate-200 appearance-none cursor-pointer hover:bg-[#222]"
                    >
                    {Object.values(CAMPUSES).map(c => (
                        <option key={c.id} value={c.id} disabled={c.id === start}>{c.name}</option>
                    ))}
                    </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          {result && (
            <div className="bg-[#0f0f0f] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-slate-900 to-slate-900 border-b border-slate-800 p-5 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Navigation size={60} /></div>
                <h3 className="font-bold text-cyan-400 text-xs uppercase tracking-[0.2em] mb-2">Analysis Complete</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tracking-tighter shadow-cyan-500/50 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
                    {result.distance}
                  </span>
                  <span className="text-slate-500 font-medium">KM Total Distance</span>
                </div>
              </div>
              
              <div className="p-6">
                 {/* Quick Stats */}
                 <div className="flex gap-3 mb-6">
                    <div className="flex-1 bg-[#161616] p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                        <div className="bg-cyan-900/30 p-2 rounded-md">
                            <Car className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mode</p>
                            <p className="text-sm font-semibold text-slate-200">Driving</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#161616] p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                        <div className="bg-purple-900/30 p-2 rounded-md">
                            <Clock className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Est. Time</p>
                            <p className="text-sm font-semibold text-slate-200">{estimatedTime} min</p>
                        </div>
                    </div>
                 </div>

                <div className="space-y-0 pl-1">
                  {result.path.map((nodeId, idx) => {
                    const isLast = idx === result.path.length - 1;
                    const isFirst = idx === 0;
                    return (
                      <div key={nodeId} className="flex gap-4 relative group">
                        {/* Timeline Line */}
                        {!isLast && (
                          <div className="absolute left-[11px] top-8 bottom-[-8px] w-[2px] bg-slate-800 group-hover:bg-cyan-900/50 transition-colors"></div>
                        )}
                        
                        {/* Dot */}
                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 shadow-lg ${
                          isFirst ? 'bg-emerald-950 border-emerald-500' : 
                          isLast ? 'bg-rose-950 border-rose-500' : 
                          'bg-[#111] border-cyan-700'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                                isFirst ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 
                                isLast ? 'bg-rose-400 shadow-[0_0_8px_#fb7185]' : 
                                'bg-cyan-400 shadow-[0_0_5px_#22d3ee]'
                            }`} />
                        </div>

                        {/* Content */}
                        <div className="pb-6">
                          <p className={`text-sm font-bold ${isFirst || isLast ? 'text-white' : 'text-slate-400'}`}>
                            {CAMPUSES[nodeId].name}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5 font-medium tracking-wide uppercase">{CAMPUSES[nodeId].description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Map */}
        <div className="lg:col-span-2 min-h-[600px] bg-[#080808] rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Map Background Grid - Cyber Style */}
          <div className="absolute inset-0 opacity-[0.15]" 
               style={{ 
                   backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                   backgroundSize: '50px 50px' 
               }}>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#080808_100%)]"></div>
          
          {/* Map Decorations */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark Abstract shapes */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-blue-900/5 skew-y-2 origin-bottom-left backdrop-blur-[0px]"></div>
            <div className="absolute top-0 right-0 w-2/3 h-32 bg-cyan-900/5 -skew-y-3 origin-top-right backdrop-blur-[0px]"></div>
          </div>

          {/* SVG Layer */}
          <svg className="absolute inset-0 w-full h-full p-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            
            {/* 1. Connections (Dimmed) */}
            {Object.entries(GRAPH).map(([source, targets]) => 
              Object.keys(targets).map(target => {
                const s = CAMPUSES[source];
                const t = CAMPUSES[target];
                return (
                  <line 
                    key={`${source}-${target}`}
                    x1={s.x} y1={s.y} 
                    x2={t.x} y2={t.y} 
                    stroke="#1e293b" 
                    strokeWidth="0.5" 
                    strokeDasharray="2 2"
                    className="opacity-50"
                  />
                );
              })
            )}

            {/* 2. Path (Glowing Neon) */}
            {result && result.path.length > 1 && (
                <>
                {/* Outer Glow */}
                <path 
                  d={`M ${result.path.map(id => `${CAMPUSES[id].x} ${CAMPUSES[id].y}`).join(' L ')}`}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-20 blur-[2px]"
                />
                {/* Core Line */}
                <path 
                  d={`M ${result.path.map(id => `${CAMPUSES[id].x} ${CAMPUSES[id].y}`).join(' L ')}`}
                  fill="none"
                  stroke="#06b6d4" 
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[dash_3s_linear_infinite]"
                  style={{ strokeDasharray: '4' }}
                />
                </>
            )}

            {/* 3. Nodes (Interactive) */}
            {Object.values(CAMPUSES).map((campus) => {
              const isActive = result?.path.includes(campus.id);
              const isStart = start === campus.id;
              const isEnd = end === campus.id;

              return (
                <g 
                    key={campus.id} 
                    className="cursor-pointer transition-all duration-300 hover:opacity-100"
                    onClick={() => {
                        if (start === campus.id) return;
                        if (start && !end) setEnd(campus.id);
                        else setEnd(campus.id);
                    }}
                >
                  {/* Ripple Effect */}
                  {(isStart || isEnd) && (
                     <circle cx={campus.x} cy={campus.y} r="8" className={`origin-center animate-ping opacity-30 ${isStart ? 'fill-emerald-500' : 'fill-rose-500'}`} />
                  )}
                  
                  {/* Outer Ring */}
                  {isActive && <circle cx={campus.x} cy={campus.y} r="4" fill="none" stroke={isStart ? '#10b981' : isEnd ? '#f43f5e' : '#06b6d4'} strokeWidth="0.5" className="opacity-50" />}

                  {/* Core Node */}
                  <circle 
                    cx={campus.x} 
                    cy={campus.y} 
                    r={isActive ? 2 : 1.5} 
                    fill={isStart ? '#10b981' : isEnd ? '#f43f5e' : isActive ? '#06b6d4' : '#334155'} 
                    stroke={isActive ? '#000' : 'none'}
                    strokeWidth="0.5"
                    className="drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  />
                  
                  {/* Label */}
                  <foreignObject x={campus.x - 15} y={campus.y + 4} width="30" height="15">
                    <div className={`text-[3px] text-center font-bold tracking-wider uppercase leading-tight ${isActive ? 'text-white scale-110 drop-shadow-[0_0_2px_black]' : 'text-slate-600'} transition-transform`}>
                        {campus.name.replace(" Campus", "")}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
          
          {/* Map Legend */}
          <div className="absolute bottom-6 right-6 bg-[#0f0f0f]/90 backdrop-blur-md p-4 rounded-xl text-xs text-slate-400 shadow-2xl border border-slate-800">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[0_0_5px_rgba(255,255,255,0.1)]"></div> 
                <span className="font-semibold tracking-wide text-[10px] uppercase">Locations</span>
            </div>
             <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-[1px] bg-slate-600 border border-slate-600 border-dashed opacity-50"></div> 
                <span className="font-semibold tracking-wide text-[10px] uppercase">Grid</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div> 
                <span className="font-bold text-cyan-400 text-[10px] uppercase">Active Path</span>
            </div>
          </div>

        </div>
      </main>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
      `}</style>
    </div>
  );
}