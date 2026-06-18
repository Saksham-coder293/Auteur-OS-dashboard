'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Activity, FileWarning, Users, Settings, 
  ChevronRight, Search, Bell, DollarSign, Target, CheckCircle2, 
  Flame, BrainCircuit, ArrowRight, RadioReceiver, XCircle, 
  TerminalSquare, Zap, Filter, Download
} from 'lucide-react';

// --- THE BRAIN (Logic) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// --- THE LOGO (Pure Code, No Images Needed) ---
const BrandLogo = () => (
  <div className="relative flex items-center justify-center w-10 h-10 group cursor-pointer">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6b00] via-[#d927a1] to-[#2b58ff] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
    {/* SVG Triangle */}
    <svg viewBox="0 0 24 24" className="w-8 h-8 relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" fill="none">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b00" />
          <stop offset="50%" stopColor="#d927a1" />
          <stop offset="100%" stopColor="#2b58ff" />
        </linearGradient>
      </defs>
      <path 
        d="M12 2.5L22 19.5H2L12 2.5Z" 
        stroke="url(#logo-grad)" 
        strokeWidth="2.5" 
        strokeLinejoin="round" 
        fill="rgba(0,0,0,0.4)" 
        className="backdrop-blur-sm"
      />
      <circle cx="12" cy="13" r="3" fill="url(#logo-grad)" opacity="0.8"/>
    </svg>
  </div>
);

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

  return (
    <div className="bg-[#03040B] text-slate-300 font-sans h-screen flex overflow-hidden selection:bg-[#d927a1]/30 selection:text-white relative">
      
      {/* Deep Space Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ff6b00]/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#2b58ff]/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Sidebar Navigation (Frosted Glass) */}
      <aside className="w-64 bg-white/[0.01] backdrop-blur-3xl border-r border-white/[0.05] flex flex-col z-20 relative shadow-2xl">
        <div className="h-24 flex items-center px-6 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <BrandLogo />
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AuteurOS
              </span>
            </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Workspace</p>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-white/[0.08] to-transparent text-white border border-white/[0.05] relative overflow-hidden group transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#ff6b00] via-[#d927a1] to-[#2b58ff]"></div>
                <LayoutDashboard className="w-4 h-4 text-[#d927a1]" />
                <span className="font-semibold text-sm tracking-wide">Command Center</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all duration-300 group">
                <RadioReceiver className="w-4 h-4 group-hover:text-[#2b58ff] transition-colors" />
                <span className="font-medium text-sm tracking-wide">Live Telemetry</span>
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all duration-300 group">
                <FileWarning className="w-4 h-4 group-hover:text-[#ff6b00] transition-colors" />
                <span className="font-medium text-sm tracking-wide">Autopsy Reports</span>
                <span className="ml-auto bg-[#ff6b00]/10 text-[#ff6b00] py-0.5 px-2 rounded-md text-xs font-bold border border-[#ff6b00]/20">3</span>
            </a>
        </nav>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top App Bar (Glass) */}
        <header className="h-24 px-10 flex items-center justify-between border-b border-white/[0.05] bg-[#03040B]/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500 font-medium">Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="text-white font-semibold tracking-wide">Nike Summer Campaign</span>
                <div className="h-5 w-px bg-white/10 mx-4"></div>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-bold tracking-widest border border-emerald-500/20 uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Zap className="w-3 h-3 fill-emerald-400" /> Network Sync Active
                </span>
            </div>
            <div className="flex items-center gap-6">
                <button className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2">
                    <Download className="w-4 h-4"/> Export Data
                </button>
            </div>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Page Header */}
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">API Telemetry</h1>
                    <p className="text-slate-400 text-sm font-medium">Real-time financial and continuity tracking for generative workflows.</p>
                </div>

                {/* KPI Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: API Spend */}
                    <div className="bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-[#ff6b00]/40 hover:shadow-[0_15px_40px_rgba(255,107,0,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Weekly API Spend</p>
                            <div className="p-2.5 bg-[#ff6b00]/10 rounded-xl border border-[#ff6b00]/20 text-[#ff6b00] group-hover:scale-110 transition-transform">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-5xl font-extrabold text-white mb-3 tracking-tight">$1,842<span className="text-slate-600 text-3xl font-bold">.50</span></h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md border border-red-500/20">+$340 (22%)</span>
                            <span className="text-xs text-slate-500 font-medium">vs last week</span>
                        </div>
                    </div>

                    {/* Card 2: Continuity */}
                    <div className="bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-[#2b58ff]/40 hover:shadow-[0_15px_40px_rgba(43,88,255,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Continuity Rate</p>
                            <div className="p-2.5 bg-[#2b58ff]/10 rounded-xl border border-[#2b58ff]/20 text-[#2b58ff] group-hover:scale-110 transition-transform">
                                <Target className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-5xl font-extrabold text-white mb-4 tracking-tight">18.4<span className="text-slate-600 text-3xl font-bold">%</span></h3>
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[#2b58ff] to-[#d927a1] h-full rounded-full" style={{ width: '18.4%' }}></div>
                        </div>
                    </div>

                    {/* Card 3: Wasted Credits */}
                    <div className="bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-[#d927a1]/40 hover:shadow-[0_15px_40px_rgba(217,39,161,0.1)]">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Est. Wasted Credits</p>
                            <div className="p-2.5 bg-[#d927a1]/10 rounded-xl border border-[#d927a1]/20 text-[#d927a1] group-hover:scale-110 transition-transform">
                                <Flame className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-5xl font-extrabold text-white mb-3 tracking-tight">$1,480<span className="text-slate-600 text-3xl font-bold">.00</span></h3>
                        <p className="text-xs text-slate-500 font-medium">Calculated from "Reject" telemetry</p>
                    </div>
                </div>

                {/* Intelligence Autopsy Banner */}
                <div className="rounded-3xl p-[1px] bg-gradient-to-r from-[#ff6b00] via-[#d927a1] to-[#2b58ff] shadow-[0_0_40px_rgba(217,39,161,0.15)] group">
                    <div className="bg-[#03040B] rounded-[23px] p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-start md:items-center h-full transition-all duration-500 group-hover:bg-[#03040B]/80">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b00]/10 via-[#d927a1]/10 to-[#2b58ff]/10 pointer-events-none opacity-50"></div>
                        
                        <div className="bg-[#d927a1]/10 p-5 rounded-2xl border border-[#d927a1]/20 shrink-0 relative z-10">
                            <BrainCircuit className="w-8 h-8 text-[#d927a1]" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-4 mb-3">
                                <h3 className="text-xl font-extrabold text-white tracking-wide">Autopsy Insight: Workflow Bottleneck</h3>
                                <span className="bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/30 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest animate-pulse">High Spend</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                                An <span className="text-white font-bold bg-red-500/20 px-1.5 py-0.5 rounded">88% failure rate</span> was detected on Runway Gen-3 when combining <code>camera pan &gt; 5</code> with the keyword <code>"neon lighting"</code>. This conflict causes severe drift and burned <strong>$142.50</strong> today.
                            </p>
                        </div>
                        <div className="shrink-0 w-full md:w-auto relative z-10">
                            <button className="w-full bg-white text-black hover:bg-slate-200 px-6 py-3.5 rounded-xl text-sm font-bold transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                Apply Auto-Filter <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Data Table */}
                <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
                        <h3 className="text-sm font-bold text-white flex items-center gap-3 tracking-widest uppercase">
                            <TerminalSquare className="w-5 h-5 text-[#2b58ff]" />
                            Live Interception Stream
                        </h3>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/5 transition-all"><Filter className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-white/[0.05]">
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5">Model & Seed</th>
                                    <th className="px-8 py-5">Prompt Payload</th>
                                    <th className="px-8 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-white/[0.02]">
                                {loading ? (
                                    <tr>
                                      <td colSpan={4} className="p-16 text-center">
                                        <div className="w-8 h-8 border-2 border-[#d927a1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <span className="text-slate-400 font-medium text-sm">Establishing secure telemetry link...</span>
                                      </td>
                                    </tr>
                                ) : !supabase ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-[#ff6b00] text-sm font-medium">Database connection required. Check Vercel .env variables.</td></tr>
                                ) : telemetryLogs.length === 0 ? (
                                    <tr>
                                      <td colSpan={4} className="p-16 text-center">
                                        <RadioReceiver className="w-10 h-10 opacity-30 mx-auto mb-3 text-slate-400" />
                                        <div className="font-medium text-slate-400">Listening for generation events...</div>
                                        <div className="text-xs text-slate-500 mt-1">Run a prompt in Runway to see data intercept here.</div>
                                      </td>
                                    </tr>
                                ) : (
                                    telemetryLogs.map((log, index) => (
                                        <tr key={log.id || index} className="hover:bg-white/[0.03] transition-colors duration-300">
                                            <td className="px-8 py-6 text-slate-400 font-mono text-xs">{formatTime(log.created_at)}</td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white tracking-wide">{log.model || 'Runway Gen-3'}</div>
                                                <div className="text-[11px] font-mono text-slate-500 mt-1">Seed: <span className="text-[#2b58ff]">{log.seed || 'Pending...'}</span></div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-slate-300 truncate max-w-[450px] font-mono text-xs bg-white/[0.02] px-4 py-2.5 rounded-lg border border-white/[0.05]">
                                                    {log.prompt || 'No prompt payload detected'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {log.status === 'kept' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Kept
                                                    </span>
                                                ) : log.status === 'rejected' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ff6b00]/20 bg-[#ff6b00]/10 text-[#ff6b00] text-[11px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                                                        <XCircle className="w-3.5 h-3.5" /> Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
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