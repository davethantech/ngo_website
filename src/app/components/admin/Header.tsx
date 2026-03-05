import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Bell, ChevronDown, Command, LogOut, User, Settings as SettingsIcon, X, FileText, FolderKanban, BarChart3, Briefcase, Clock, Menu, Activity, HelpCircle, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePrefs } from '../../context/PrefsContext';

const quickNavLinks = [
    { label: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { label: 'Initiatives', path: '/admin/initiatives', icon: FolderKanban },
    { label: 'Impact Metrics', path: '/admin/metrics', icon: BarChart3 },
    { label: 'Careers', path: '/admin/careers', icon: Briefcase },
];

interface SearchResult {
    label: string;
    sub: string;
    path: string;
}

const NAV_INDEX: SearchResult[] = [
    { label: 'Dashboard', sub: 'Admin Page', path: '/admin' },
    { label: 'Blog', sub: 'Admin Page', path: '/admin/blog' },
    { label: 'Blog Posts', sub: 'Admin Page', path: '/admin/blog' },
    { label: 'Initiatives', sub: 'Admin Page', path: '/admin/initiatives' },
    { label: 'Impact Metrics', sub: 'Admin Page', path: '/admin/metrics' },
    { label: 'Metrics', sub: 'Admin Page', path: '/admin/metrics' },
    { label: 'FAQ', sub: 'Admin Page', path: '/admin/faq' },
    { label: 'Careers', sub: 'Admin Page', path: '/admin/careers' },
    { label: 'Inbox', sub: 'Admin Page', path: '/admin/inbox' },
    { label: 'Messages', sub: 'Admin Page', path: '/admin/inbox' },
    { label: 'Settings', sub: 'Admin Page', path: '/admin/settings' },
    { label: 'Profile Settings', sub: 'Admin Page', path: '/admin/settings' },
];

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [userDisplayName, setUserDisplayName] = useState('L.O.F Admin');
    const [userEmail, setUserEmail] = useState('admin@lof.org');

    const { prefs } = usePrefs();
    const [liveTime, setLiveTime] = useState('');

    useEffect(() => {
        const TZ_LABELS: Record<string, string> = {
            'Africa/Lagos': 'WAT',
            'UTC': 'UTC',
            'Europe/London': 'GMT',
            'America/New_York': 'EST',
        };
        const tick = () => {
            const t = new Date().toLocaleTimeString('en-US', {
                timeZone: prefs.timezone,
                hour: '2-digit',
                minute: '2-digit',
            });
            setLiveTime(`${t} ${TZ_LABELS[prefs.timezone] || ''}`);
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [prefs.timezone]);

    const avatarInitials = userDisplayName
        .split(' ')
        .slice(0, 2)
        .map(w => w[0]?.toUpperCase() || '')
        .join('');

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserDisplayName(user.user_metadata?.display_name || 'L.O.F Admin');
                setUserEmail(user.email || 'admin@lof.org');
            }
        };
        loadUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUserDisplayName(session.user.user_metadata?.display_name || 'L.O.F Admin');
                setUserEmail(session.user.email || 'admin@lof.org');
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
            if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setShowNotifications(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
            if (e.key === 'Escape') { setShowSearch(false); setShowProfile(false); setShowNotifications(false); }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        async function fetchNotifications() {
            const [subs, blogs] = await Promise.all([
                supabase.from('contact_submissions').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(4),
                supabase.from('blog_posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(4),
            ]);
            const items = [
                ...(subs.data || []).map((s: any) => ({ id: s.id, label: 'New Inquiry', sub: s.full_name, time: s.created_at, read: false })),
                ...(blogs.data || []).map((b: any) => ({ id: b.id, label: 'Blog Post Published', sub: b.title, time: b.created_at, read: true })),
            ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
            setNotifications(items);
            setUnreadCount(items.filter(n => !n.read).length);
        }
        fetchNotifications();
    }, []);

    const runSearch = useCallback(async (q: string) => {
        if (!q.trim()) { setSearchResults([]); return; }
        setIsSearching(true);
        const term = q.toLowerCase();
        const navResults = NAV_INDEX.filter(n => n.label.toLowerCase().includes(term));
        const [blogs, inits, careers] = await Promise.all([
            supabase.from('blog_posts').select('id, title').ilike('title', `%${q}%`).limit(3),
            supabase.from('initiatives').select('id, title').ilike('title', `%${q}%`).limit(3),
            supabase.from('career_listings').select('id, title').ilike('title', `%${q}%`).limit(3),
        ]);
        const dbResults: SearchResult[] = [
            ...(blogs.data || []).map((b: any) => ({ label: b.title, sub: 'Blog Post', path: '/admin/blog' })),
            ...(inits.data || []).map((i: any) => ({ label: i.title, sub: 'Initiative', path: '/admin/initiatives' })),
            ...(careers.data || []).map((c: any) => ({ label: c.title, sub: 'Career Listing', path: '/admin/careers' })),
        ];
        const seen = new Set<string>();
        const merged: SearchResult[] = [];
        for (const r of [...navResults, ...dbResults]) {
            const key = r.path + r.label;
            if (!seen.has(key)) { seen.add(key); merged.push(r); }
        }
        setSearchResults(merged.slice(0, 8));
        setIsSearching(false);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => runSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, runSearch]);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Logged out successfully');
            window.location.href = '/login';
        } catch (error: any) {
            toast.error('Logout failed: ' + error.message);
        }
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setShowSearch(false);
        setShowProfile(false);
    };

    const formatTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        return `${hours}h ago`;
    };

    return (
        <>
            <header className="h-20 backdrop-blur-xl bg-white/5 border-b border-white/10 px-4 md:px-8 flex items-center justify-between shrink-0 relative z-40">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2.5 mr-2 bg-white/5 border border-white/10 rounded-xl text-[#94A3B8] hover:text-white transition-all flex items-center justify-center shrink-0"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex-1 max-w-xl hidden sm:block">
                    <button
                        onClick={() => setShowSearch(true)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                    >
                        <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
                        <span className="text-[#94A3B8] text-sm truncate">Quick Search...</span>
                        <div className="ml-auto hidden md:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                            <Command className="w-3 h-3 text-[#94A3B8]" />
                            <span className="text-xs text-[#94A3B8]">K</span>
                        </div>
                    </button>
                </div>

                <button
                    onClick={() => setShowSearch(true)}
                    className="sm:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-[#94A3B8] hover:text-white transition-all mr-auto"
                >
                    <Search className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 md:gap-4">
                    {liveTime && (
                        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs font-mono text-[#94A3B8]">{liveTime}</span>
                        </div>
                    )}

                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <Bell className="w-5 h-5 text-[#94A3B8] group-hover:text-white transition-colors" />
                            {unreadCount > 0 && (
                                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B0E14]" />
                            )}
                        </button>
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-3 w-80 backdrop-blur-xl bg-[#0F1219]/95 border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                                        <h4 className="text-sm font-bold text-white">Notifications</h4>
                                        {unreadCount > 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{unreadCount} new</span>}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <p className="text-center text-xs text-gray-500 py-10">No recent activity</p>
                                        ) : notifications.map((n, i) => (
                                            <div key={i} className={`px-4 py-3 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 cursor-pointer ${!n.read ? 'bg-emerald-500/5' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-medium text-white truncate">{n.label}</p>
                                                        <p className="text-xs text-gray-400 truncate">{n.sub}</p>
                                                        <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-tight">{formatTime(n.time)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-white/10 bg-white/5">
                                        <button onClick={() => { handleNavigate('/admin/inbox'); setShowNotifications(false); }} className="w-full py-2 bg-[#10B981] rounded-xl text-xs font-bold text-white hover:bg-emerald-500 transition-all">
                                            Open Inbox
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                            className="flex items-center gap-2 md:gap-3 p-1 md:pr-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        >
                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-[#10B981] to-emerald-600 flex items-center justify-center border border-white/10 shrink-0">
                                <span className="text-white text-xs font-bold uppercase tracking-tighter">{avatarInitials}</span>
                            </div>
                            <div className="text-left hidden lg:block">
                                <div className="text-xs font-bold text-white truncate max-w-[100px]">{userDisplayName}</div>
                                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Admin</div>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-500 hidden md:block ${showProfile ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-3 w-64 backdrop-blur-xl bg-[#0F1219]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] p-2"
                                >
                                    <div className="px-3 py-3 mb-2 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10B981] to-emerald-600 flex items-center justify-center border border-white/10">
                                                <span className="text-white text-sm font-black tracking-tighter">{avatarInitials}</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold text-white truncate">{userDisplayName}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleNavigate('/admin/settings?tab=profile')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                        <User className="w-4 h-4 text-emerald-500" /> Account Profile
                                    </button>
                                    <button onClick={() => handleNavigate('/admin/settings?tab=preferences')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                        <SettingsIcon className="w-4 h-4 text-emerald-500" /> Site Preferences
                                    </button>
                                    <div className="my-2 h-px bg-white/10 mx-2" />
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                                        <LogOut className="w-4 h-4" /> Sign Out from Panel
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </header>

            {/* Search Portal — renders outside the header stacking context */}
            {createPortal(
                <AnimatePresence>
                    {showSearch && (
                        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                className="absolute inset-0 bg-[#0B0E14]/90 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ scale: 0.96, y: -16, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.96, y: -16, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                className="relative w-full max-w-2xl mx-4 mt-24 mb-8 backdrop-blur-2xl bg-[#0B0E14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                            >
                                <div className="flex items-center gap-4 px-6 py-5 border-b border-white/10 bg-white/5">
                                    <Search className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search command center..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-white placeholder:text-gray-600 outline-none text-base font-medium"
                                        autoFocus
                                    />
                                    <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500 hover:text-white transition-all">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                                    {(searchResults.length > 0 || isSearching) ? (
                                        <div className="space-y-1">
                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Results</h4>
                                            {isSearching ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                                    <p className="text-gray-500 text-sm font-medium">Scanning Mission Database...</p>
                                                </div>
                                            ) : searchResults.map((r, i) => (
                                                <button key={i} onClick={() => handleNavigate(r.path)} className="w-full text-left flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 group transition-all">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#10B981] group-hover:border-[#10B981] group-hover:shadow-lg group-hover:shadow-emerald-500/20 text-emerald-500 group-hover:text-white transition-all shrink-0">
                                                        <Search className="w-5 h-5" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors truncate">{r.label}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{r.sub}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div className="col-span-full">
                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Quick Access</h4>
                                            </div>
                                            {quickNavLinks.map(({ label, path, icon: Icon }) => (
                                                <button key={label} onClick={() => handleNavigate(path)} className="flex items-center gap-3 text-left p-3 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/10 transition-all">
                                                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
