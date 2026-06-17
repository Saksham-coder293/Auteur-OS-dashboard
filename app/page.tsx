'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Activity, FileWarning, Users, Settings, 
  ChevronRight, Search, Bell, DollarSign, TrendingUp, CheckCircle2, 
  Flame, BrainCircuit, ArrowRightCircle, RadioReceiver, Filter, Download, XCircle 
} from 'lucide-react';

// 1. Initialize Supabase (This pulls your keys from the .env.local file you created)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function Dashboard() {
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.error('Missing Supabase keys! Check your .env.local file.');
      setLoading(false);
      return;
    }

    // 2. Fetch the initial data when the page first loads
    fetchGenerations();

    // 3. THE MAGIC: Set up the REAL-TIME listener
    // This listens to your Supabase database. The exact millisecond your Chrome extension 
    // pushes new data, this code catches it and updates the table without refreshing the page.
    const subscription = supabase
      .channel('public:generations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'generations' }, payload => {
        console.log("New generation intercepted!", payload.new);
        setTelemetryLogs(current => [payload.new, ...current]);
      })
      .subscribe();

    // Cleanup the listener if they leave the page
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchGenerations() {
    try {
      if (!supabase) return;
      // Change 'generations' below to whatever you named your Supabase table
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      if (data) setTelemetryLogs(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-slate-950 text-slate-300 font-sans h-screen flex overflow-hidden selection:bg-pink-500 selection:text-white dark">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 relative">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="AuteurOS Logo" className="h-10 w-auto object-contain" />
                <span className="text-2xl font-bold tracking-tight text-white">AuteurOS</span>
            </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 text-white border border-slate-700/50 relative overflow-hidden group">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-pink-500"></div>
                <LayoutDashboard className="w-5 h-5 text-pink-500" />
                <span className="font-medium">Command Center</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
                <Activity className="w-5 h-5" />
                <span className="font-medium">Live Telemetry</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
                <FileWarning className="w-5 h-5" />
                <span className="font-medium">Autopsy Reports</span>
                <span className="ml-auto bg-red-500/10 text-red-500 py-0.5 px-2 rounded text-xs font-bold border border-red-500/20">3</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
                <span className="font-medium">Team Pipeline</span>
            </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="text-white font-medium">Agency Demo</span>
                <span className="ml-3 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supabase Live Sync Connected
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-medium transition">
                    Export CSV
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 z-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">API Pipeline Analytics</h1>
                    <p className="text-slate-400 text-sm">Real-time cost and continuity tracking for generative workflows.</p>
                </div>

                {/* Financial Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-slate-400 font-medium text-sm mb-1">Total API Spend (Week)</p>
                                <h3 className="text-3xl font-bold text-white">$1,842.50</h3>
                            </div>
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <DollarSign className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-slate-400 font-medium text-sm mb-1">Continuity Keeper Rate</p>
                                <h3 className="text-3xl font-bold text-white">18.4%</h3>
                            </div>
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '18.4%' }}></div>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition shadow-sm hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-orange-500 font-medium text-sm mb-1">Estimated Wasted Credits</p>
                                <h3 className="text-3xl font-bold text-white">$1,480.00</h3>
                            </div>
                            <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Autopsy Report */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-900 border border-pink-500/30 rounded-xl p-1 relative overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.05)]">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-pink-500"></div>
                    <div className="bg-slate-950 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-pink-500/10 p-3 rounded-xl border border-pink-500/20 shrink-0">
                            <BrainCircuit className="w-8 h-8 text-pink-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">Autopsy Intelligence Insight</h3>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">High Spend Alert</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                <strong className="text-white">Pattern Detected:</strong> Your team is experiencing an <span className="text-red-400 font-semibold">88% failure rate</span> on Runway Gen-3 when combining <code>camera pan &gt; 5</code> with the keyword <code>"neon lighting"</code>. This is causing character drift and has burned <strong>$142.50</strong> today.
                            </p>
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <ArrowRightCircle className="w-5 h-5 text-emerald-400" />
                                    <p className="text-sm text-slate-300"><strong>Recommendation:</strong> Drop pan speed to <code>3</code> and add negative prompt <code>"multiple light sources"</code>.</p>
                                </div>
                                <button className="shrink-0 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                                    Apply Rule to Pipeline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Telemetry Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
                    <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <RadioReceiver className="w-5 h-5 text-blue-500" />
                            Live Interception Stream
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Time</th>
                                    <th className="px-6 py-4 font-medium">Model & Seed</th>
                                    <th className="px-6 py-4 font-medium">Prompt Payload</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-800/50 bg-slate-900/30">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">Connecting to Supabase Database...</td></tr>
                                ) : !supabase ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-red-500">Missing .env.local configuration for Supabase.</td></tr>
                                ) : telemetryLogs.length === 0 ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">Listening to Runway. Generate a video to see data appear here...</td></tr>
                                ) : (
                                    telemetryLogs.map((log, index) => (
                                        <tr key={log.id || index} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">{formatTime(log.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{log.model || 'Runway Gen-3'}</div>
                                                <div className="text-xs font-mono text-slate-500">Seed: {log.seed || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-slate-300 truncate max-w-[400px] font-mono text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                                    "{log.prompt || 'No prompt payload detected'}"
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.status === 'kept' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Kept
                                                    </span>
                                                ) : log.status === 'rejected' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium">
                                                        <XCircle className="w-3.5 h-3.5" /> Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-medium">
                                                        <Activity className="w-3.5 h-3.5" /> Tracked
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
