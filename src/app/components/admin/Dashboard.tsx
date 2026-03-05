import { TrendingUp, Users, Target, Globe, ArrowUpRight, Clock, Activity, Zap, FileText, FolderKanban, Mail, Shield, RefreshCw } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { SkeletonLoader } from './SkeletonLoader';
import { toast } from 'sonner';

const impactData = [
    { value: 45, label: 'Jan' }, { value: 52, label: 'Feb' }, { value: 48, label: 'Mar' }, { value: 65, label: 'Apr' },
    { value: 58, label: 'May' }, { value: 72, label: 'Jun' }, { value: 68, label: 'Jul' }, { value: 85, label: 'Aug' },
];

export function Dashboard() {
    const navigate = useNavigate();
    const [chartView, setChartView] = useState<'8months' | 'quarterly'>('8months');
    const [metrics, setMetrics] = useState([
        { title: 'Global Impact', value: '...', change: 'Steady', icon: Globe, color: 'from-blue-500 to-cyan-500', data: impactData },
        { title: 'Active Initiatives', value: '...', change: '...', icon: Target, color: 'from-[#10B981] to-emerald-600', data: impactData },
        { title: 'Pending Inquiries', value: '...', change: '...', icon: Users, color: 'from-purple-500 to-pink-500', data: impactData },
        { title: 'Content Items', value: '...', change: 'Live', icon: TrendingUp, color: 'from-amber-500 to-orange-500', data: impactData },
    ]);
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                // Real-time counting and fetching from Supabase
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

                const [initRes, contactRes, blogRes, metricRes, recentBlogs, recentInits, recentSubs] = await Promise.all([
                    supabase.from('initiatives').select('*', { count: 'exact', head: true }),
                    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'New'),
                    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
                    supabase.from('impact_metrics').select('*'),
                    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(5),
                    supabase.from('initiatives').select('*').order('created_at', { ascending: false }).limit(5),
                    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
                ]);

                // Calculate Initiatives Trend (created in last 30 days)
                const recentInitsCount = (initRes.data as any[])?.filter(i => i.created_at > thirtyDaysAgo).length || 0;

                // Find Global Impact Value
                const globalImpactMetric = (metricRes.data as any[])?.find(m => m.label.toLowerCase().includes('impact') || m.label.toLowerCase().includes('global')) || metricRes.data?.[0];

                setMetrics([
                    {
                        title: 'Global Impact',
                        value: globalImpactMetric?.value || '150K+',
                        change: 'Verified',
                        icon: Globe,
                        color: 'from-blue-500 to-cyan-500',
                        data: impactData
                    },
                    {
                        title: 'Active Initiatives',
                        value: String(initRes.count || 0),
                        change: recentInitsCount > 0 ? `+${recentInitsCount} new` : 'Stable',
                        icon: Target,
                        color: 'from-[#10B981] to-emerald-600',
                        data: impactData
                    },
                    {
                        title: 'Pending Inquiries',
                        value: String(contactRes.count || 0),
                        change: 'Awaiting',
                        icon: Users,
                        color: 'from-purple-500 to-pink-500',
                        data: impactData
                    },
                    {
                        title: 'Content Items',
                        value: String((blogRes.count || 0) + (metricRes.data?.length || 0)),
                        change: 'Live',
                        icon: TrendingUp,
                        color: 'from-amber-500 to-orange-500',
                        data: impactData
                    },
                ]);

                // Merge and format activity feed
                const allActivities = [
                    ...(recentBlogs.data || []).map(b => ({ label: 'Blog Published', user: b.author, time: b.created_at, type: 'blog' })),
                    ...(recentInits.data || []).map(i => ({ label: 'New Initiative', user: 'System', time: i.created_at, type: 'init' })),
                    ...(recentSubs.data || []).map(s => ({ label: 'Inquiry Received', user: s.full_name.split(' ')[0], time: s.created_at, type: 'inbox' })),
                ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

                // Add a welcome activity if empty
                if (allActivities.length === 0) {
                    allActivities.push({
                        label: 'Command Center Ready',
                        user: 'System',
                        time: new Date().toISOString(),
                        type: 'system'
                    });
                }

                setActivities(allActivities);
            } catch (error: any) {
                console.error('Error loading dashboard:', error);
                toast.error('Failed to sync dashboard data: ' + error.message);
            }
        }
        loadDashboardData();
    }, []);

    if (metrics[0].value === '...') return <SkeletonLoader />;

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const getActivityMeta = (type: string) => {
        switch (type) {
            case 'blog': return { icon: FileText, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', tag: 'BLOG' };
            case 'init': return { icon: FolderKanban, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', tag: 'INITIATIVE' };
            case 'inbox': return { icon: Mail, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', tag: 'INQUIRY' };
            case 'system': return { icon: Zap, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', tag: 'SYSTEM' };
            case 'auth': return { icon: Shield, color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', tag: 'AUTH' };
            default: return { icon: RefreshCw, color: 'from-gray-500 to-slate-500', bg: 'bg-white/5', border: 'border-white/10', text: 'text-gray-400', tag: 'EVENT' };
        }
    };

    return (
        <div className="space-y-6 md:space-y-10">
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Mission Control</h1>
                    <p className="text-sm text-[#94A3B8] font-medium">Real-time pulse of L.O.F operations and foundation impact.</p>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-black uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live System Sync
                </div>
            </div>

            {/* Snapshot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-6 hover:bg-white/10 transition-all duration-500 overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                        <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${metric.color} shadow-xl shadow-black/40 border border-white/10`}>
                                    <metric.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10 uppercase tracking-wider">
                                    <Activity className="w-3 h-3" />
                                    {metric.change}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter tabular-nums drop-shadow-2xl">{metric.value}</div>
                                <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">{metric.title}</div>
                            </div>

                            <div className="h-12 opacity-40 group-hover:opacity-70 transition-opacity">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={metric.data}>
                                        <Line type="monotone" dataKey="value" stroke={metric.color.includes('emerald') ? '#10B981' : '#6366f1'} strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Trend Visualization */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="xl:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-10 flex flex-col"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Growth Trajectory</h3>
                            </div>
                            <p className="text-xs md:text-sm text-[#94A3B8] font-medium">Aggregate baseline growth across all foundation KPIs</p>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-stretch sm:self-auto">
                            <button
                                onClick={() => setChartView('8months')}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${chartView === '8months' ? 'text-white bg-[#10B981] shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                8 Months
                            </button>
                            <button
                                onClick={() => setChartView('quarterly')}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${chartView === 'quarterly' ? 'text-white bg-[#10B981] shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                Quarterly
                            </button>
                        </div>
                    </div>

                    <div className="h-64 sm:h-80 w-full relative group">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full opacity-20" />
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartView === '8months' ? impactData : impactData.slice(-4)}>
                                <defs>
                                    <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={5} fill="url(#areaGlow)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Live Pulse */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-10 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Live Pulse</h3>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">System Activity Log</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time</span>
                        </div>
                    </div>

                    <div className="flex-grow space-y-3 overflow-y-auto max-h-80 custom-scrollbar pr-1">
                        {activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 opacity-40">
                                <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                    <Clock className="w-7 h-7 text-gray-500 stroke-[1]" />
                                </div>
                                <p className="text-[#94A3B8] text-sm font-medium">System idle. Monitoring activity...</p>
                            </div>
                        ) : (
                            activities.map((event, i) => {
                                const meta = getActivityMeta(event.type);
                                const IconComp = meta.icon;
                                return (
                                    <div key={i} className={`flex gap-4 items-start p-4 rounded-2xl border ${meta.border} ${meta.bg} group cursor-default transition-all hover:bg-white/5`}>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shrink-0 shadow-lg`}>
                                            <IconComp className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border ${meta.border} ${meta.bg} ${meta.text}`}>{meta.tag}</span>
                                            </div>
                                            <p className="text-sm font-bold text-white truncate">{event.label}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-gray-500 font-bold truncate max-w-[120px]">{event.user}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />
                                                <span className="text-[10px] text-gray-600 shrink-0">{formatTime(event.time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
