'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Activity, FileWarning, Users, Settings, 
  ChevronRight, Search, Bell, DollarSign, Target, CheckCircle2, 
  Flame, BrainCircuit, ArrowRight, RadioReceiver, XCircle, 
  Sparkles, TerminalSquare
} from 'lucide-react';

// --- THE BRAIN (Logic) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function Dashboard() {
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.error('Missing Supabase keys!');
      setLoading(false);
      return;
    }

    fetchGenerations();

    const subscription = supabase
      .channel('public:generations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'generations' }, payload => {
        setTelemetryLogs(current => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchGenerations() {
    try {
      if (!supabase) return;
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

  // --- THE FACE (UI) ---
  return (
    <div className="bg-[#0B0D17] text-slate-300 font-sans h-screen flex overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0B0D17] border-r border-slate-800/60 flex flex-col z-20 relative">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                  <div className="w-full h-full bg-[#0B0D17] rounded-[7px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">AuteurOS</span>
            </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Workspace</p>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 transition-all">
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-medium text-sm">Command Center</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all group">
                <RadioReceiver className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-sm">Live Telemetry</span>
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all group">
                <FileWarning className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                <span className="font-medium text-sm">Autopsy Reports</span>
                <span className="ml-auto bg-amber-500/10 text-amber-500 py-0.5 px-2 rounded-md text-xs font-bold border border-amber-500/20">3</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-white transition-all group">
                <Users className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                <span className="font-medium text-sm">Team Pipeline</span>
            </a>
        </nav>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top App Bar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/60 bg-[#0B0D17]/80 backdrop-blur-xl z-10 sticky top-0">
            <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500 font-medium">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="text-slate-200 font-medium tracking-wide">Nike Summer Campaign</span>
                <div className="h-4 w-px bg-slate-700 mx-3"></div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-wide border border-emerald-500/20 uppercase flex items-center gap-1.5">
                    Live Sync Active
                </span>
            </div>
            <div className="flex items-center gap-5">
                <Search className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Bell className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <button className="bg-white text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] ml-2">
                    Export CSV
                </button>
            </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Telemetry Overview</h1>
                    <p className="text-slate-400 text-sm font-medium">Real-time financial and continuity tracking for generative AI workflows.</p>
                </div>

                {/* KPI Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1 */}
                    <div className="bg-[#131627]/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Weekly API Spend</p>
                            <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <DollarSign className="w-4 h-4 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">$1,842<span className="text-slate-500 text-2xl">.50</span></h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">+$340 (22%)</span>
                            <span className="text-xs text-slate-500 font-medium">vs last week</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#131627]/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Continuity Keeper Rate</p>
                            <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <Target className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">18.4<span className="text-slate-500 text-2xl">%</span></h3>
                        <div className="w-full bg-slate-800/60 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '18.4%' }}></div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#131627]/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Est. Wasted Credits</p>
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <Flame className="w-4 h-4 text-amber-500" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">$1,480<span className="text-slate-500 text-2xl">.00</span></h3>
                        <p className="text-xs text-slate-500 font-medium">Calculated from "Reject" telemetry</p>
                    </div>
                </div>

                {/* Intelligence Autopsy Banner */}
                <div className="bg-gradient-to-r from-[#1E1B2E] to-[#131627] border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 shrink-0 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
                            <BrainCircuit className="w-7 h-7 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-base font-bold text-white tracking-wide">Autopsy Insight: Workflow Bottleneck</h3>
                                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">High Spend</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                                An <span className="text-white font-semibold">88% failure rate</span> was detected on Runway Gen-3 when combining <code>camera pan &gt; 5</code> with the keyword <code>"neon lighting"</code>. This parameter conflict is causing severe character drift and has burned <strong>$142.50</strong> today.
                            </p>
                        </div>
                        <div className="shrink-0 w-full md:w-auto">
                            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2">
                                Apply Auto-Filter <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Data Table */}
                <div className="bg-[#131627]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-[#0B0D17]/50">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
                            <TerminalSquare className="w-4 h-4 text-slate-400" />
                            LIVE INTERCEPTION STREAM
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0B0D17]/80 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800/80">
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Model & Seed</th>
                                    <th className="px-6 py-4">Prompt Payload</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-800/40">
                                {loading ? (
                                    <tr>
                                      <td colSpan={4} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                          <span className="text-slate-500 font-medium text-sm">Establishing secure telemetry link...</span>
                                        </div>
                                      </td>
                                    </tr>
                                ) : !supabase ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-red-400 text-sm font-medium bg-red-500/5">Database connection required. Check .env variables.</td></tr>
                                ) : telemetryLogs.length === 0 ? (
                                    <tr>
                                      <td colSpan={4} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                          <RadioReceiver className="w-8 h-8 opacity-50 mb-2" />
                                          <span className="font-medium">Listening for generation events...</span>
                                          <span className="text-xs">Run a prompt in Runway or Kling to see data here.</span>
                                        </div>
                                      </td>
                                    </tr>
                                ) : (
                                    telemetryLogs.map((log, index) => (
                                        <tr key={log.id || index} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{formatTime(log.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-200">{log.model || 'Runway Gen-3'}</div>
                                                <div className="text-[11px] font-mono text-slate-500 mt-0.5">Seed: <span className="text-indigo-300">{log.seed || 'Pending...'}</span></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-slate-300 truncate max-w-[400px] font-mono text-xs bg-[#0B0D17] px-3 py-1.5 rounded-md border border-slate-800/80 text-ellipsis overflow-hidden">
                                                    {log.prompt || 'No prompt payload detected'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.status === 'kept' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Kept
                                                    </span>
                                                ) : log.status === 'rejected' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-red-500/20 bg-red-500/10 text-red-400 text-[11px] font-bold uppercase tracking-wider">
                                                        <XCircle className="w-3.5 h-3.5" /> Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-500/20 bg-slate-500/10 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
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
