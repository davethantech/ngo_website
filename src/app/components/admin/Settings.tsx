import { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, Save, Lock, User, Sliders, Bell, Check, Clock, Globe, Mail, Key, Send, CheckCircle2, XCircle, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { usePrefs } from '../../context/PrefsContext';

type Tab = 'profile' | 'security' | 'preferences';

const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Configuration', icon: Sliders },
];

export function Settings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = (searchParams.get('tab') as Tab) || 'profile';
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);

    // Sync tab with URL query param
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    // Profile state
    const [displayName, setDisplayName] = useState('L.O.F Admin');
    const [email, setEmail] = useState('admin@lof.org');
    const [savingProfile, setSavingProfile] = useState(false);

    // Derive initials from displayName
    const initials = displayName
        .split(' ')
        .slice(0, 2)
        .map(n => n[0]?.toUpperCase() || '')
        .join('');

    // Security state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);


    // Load current user info
    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || 'admin@lof.org');
                setDisplayName(user.user_metadata?.display_name || 'L.O.F Admin');
            }
        }
        loadUser();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSavingProfile(true);
            const { error } = await supabase.auth.updateUser({
                data: { display_name: displayName },
            });
            if (error) throw error;
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error('Failed to update profile: ' + error.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            setSavingPassword(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast.success('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error('Failed to update password: ' + error.message);
        } finally {
            setSavingPassword(false);
        }
    };

    // Preferences from shared context
    const { prefs, setPrefs, savePrefs, browserPermission, requestBrowserPermission } = usePrefs();
    const [localPrefs, setLocalPrefs] = useState(prefs);
    const [savingPrefs, setSavingPrefs] = useState(false);
    const [liveTime, setLiveTime] = useState('');

    // Email config state — loaded from system_settings table
    const [emailConfig, setEmailConfig] = useState({
        resend_api_key: '',
        admin_email: '',
        from_email: 'onboarding@resend.dev',
        from_name: 'LOF Command Center',
        enabled: false,
    });
    const [emailConfigured, setEmailConfigured] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);

    // Load email config from system_settings
    useEffect(() => {
        async function loadEmailConfig() {
            const { data } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'email_config')
                .single();
            if (data?.value) {
                setEmailConfig(prev => ({ ...prev, ...data.value }));
                setEmailConfigured(
                    !!(data.value.resend_api_key && data.value.admin_email)
                );
            }
        }
        loadEmailConfig();
    }, []);

    const handleSaveEmailConfig = async () => {
        if (!emailConfig.resend_api_key.trim()) {
            toast.error('Please enter your Resend API key');
            return;
        }
        if (!emailConfig.admin_email.trim()) {
            toast.error('Please enter the destination email address');
            return;
        }
        setSavingEmail(true);
        try {
            const value = { ...emailConfig, enabled: localPrefs.emailNotifications };
            const { error } = await supabase
                .from('system_settings')
                .upsert({ key: 'email_config', value, updated_at: new Date().toISOString() });
            if (error) throw error;
            setEmailConfigured(true);
            setShowEmailForm(false);
            toast.success('Email configuration saved');
        } catch (e: any) {
            toast.error('Failed to save: ' + e.message);
        } finally {
            setSavingEmail(false);
        }
    };

    const handleTestEmail = async () => {
        if (!emailConfig.resend_api_key || !emailConfig.admin_email) return;
        setTestingEmail(true);
        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${emailConfig.resend_api_key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: `${emailConfig.from_name} <${emailConfig.from_email || 'onboarding@resend.dev'}>`,
                    to: [emailConfig.admin_email],
                    subject: '✅ Email Notifications Active — LOF Command Center',
                    html: '<p>Your email notification pipeline is correctly configured and working. You will now receive alerts when new inquiries are submitted.</p>',
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Resend rejected the request');
            }
            toast.success('Test email sent! Check your inbox.');
        } catch (e: any) {
            toast.error('Test failed: ' + e.message);
        } finally {
            setTestingEmail(false);
        }
    };

    const handleToggleEmail = (on: boolean) => {
        setLocalPrefs(p => ({ ...p, emailNotifications: on }));
        if (on && !emailConfigured) setShowEmailForm(true);
        if (!on) setShowEmailForm(false);
    };

    // Sync localPrefs when context prefs load from Supabase
    useEffect(() => { setLocalPrefs(prefs); }, [prefs]);

    // Live clock for timezone preview
    useEffect(() => {
        const updateClock = () => {
            setLiveTime(new Date().toLocaleTimeString('en-US', {
                timeZone: localPrefs.timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, [localPrefs.timezone]);

    const handleToggleBrowserNotifications = async () => {
        if (!localPrefs.browserNotifications) {
            // Turning ON — request real browser permission
            await requestBrowserPermission();
            if (Notification.permission === 'granted') {
                setLocalPrefs(p => ({ ...p, browserNotifications: true }));
                toast.success('Browser notifications enabled');
            } else if (Notification.permission === 'denied') {
                toast.error('Permission denied. Please enable notifications in your browser settings.');
            }
        } else {
            // Turning OFF
            setLocalPrefs(p => ({ ...p, browserNotifications: false }));
        }
    };

    const handleSavePreferences = async () => {
        setSavingPrefs(true);
        try {
            await savePrefs(localPrefs);
            toast.success('Preferences saved');
        } catch {
            toast.error('Failed to save preferences');
        } finally {
            setSavingPrefs(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-10">
            {/* Page Header */}
            <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">System Configuration</h1>
                <p className="text-sm text-[#94A3B8] font-medium leading-relaxed">Manage your administrative identity, security protocols, and operational preferences.</p>
            </div>

            {/* Tab Navigation — Scrollable on mobile */}
            <div className="relative group/tabs flex items-center">
                <div className="hidden sm:flex absolute -left-12 p-3 text-gray-700 opacity-20 group-hover/tabs:text-[#10B981] group-hover/tabs:opacity-100 transition-all">
                    <Sliders className="w-5 h-5 rotate-90" />
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar touch-pan-x w-fit max-w-full">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => handleTabChange(id)}
                            className={`relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shrink-0 ${activeTab === id
                                ? 'bg-[#10B981] text-white shadow-xl shadow-emerald-500/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {/* ── PROFILE TAB ── */}
                {activeTab === 'profile' && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                        {/* Avatar card */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col items-center gap-6 relative overflow-hidden group/avatar h-fit">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border-4 border-white/10 group-hover/avatar:scale-110 transition-transform duration-500">
                                <span className="text-white text-4xl font-black drop-shadow-lg">{initials}</span>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border border-gray-100 text-emerald-600">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-center relative">
                                <p className="text-xl font-black text-white group-hover:text-[#10B981] transition-colors">{displayName}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1.5">{email}</p>
                            </div>
                            <div className="w-full relative px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-center group-hover:border-emerald-500/30 transition-colors">
                                <span className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.3em]">Full Administrator</span>
                            </div>
                        </div>

                        {/* Profile form */}
                        <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-5 mb-10 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <User className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Public Identity</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mt-1">Manage global display settings</p>
                                </div>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-emerald-500" /> Administrative Handle
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white outline-none focus:border-emerald-500/50 transition-all font-black border-l-4 border-l-transparent focus:border-l-[#10B981]"
                                        placeholder="L.O.F Admin"
                                    />
                                </div>
                                <div className="space-y-3 text-left opacity-60 group/disabled">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> Root Authentication Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-gray-400 outline-none cursor-not-allowed font-medium"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Locked</div>
                                    </div>
                                    <p className="text-[10px] text-gray-700 px-2 font-bold uppercase tracking-widest leading-relaxed">System-wide identifier. Cannot be modified via standard GUI.</p>
                                </div>
                                <div className="pt-4 text-left">
                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-emerald-500/30 disabled:opacity-50 transition-all active:scale-[0.98]"
                                    >
                                        {savingProfile ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                                        {savingProfile ? 'Updating Core...' : 'Sync Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ── SECURITY TAB ── */}
                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                        {/* Status card */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-8 relative overflow-hidden group/security h-fit">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full" />
                            <div className="w-14 h-14 rounded-2xl bg-[#10B981] flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/20">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Security Hardening</h3>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Active Protection
                            </p>
                            <div className="space-y-6">
                                {['Root Access Guard', 'Field-level Security', 'Encrypted Transport'].map(item => (
                                    <div key={item} className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-lg shadow-emerald-500/40" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Password form */}
                        <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-5 mb-10 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Lock className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Access Control</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mt-1">Rotate administrative credentials</p>
                                </div>
                            </div>
                            <form onSubmit={handleUpdatePassword} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                            <Key className="w-3.5 h-3.5 text-emerald-500" /> New Password
                                        </label>
                                        <div className="relative group/pass">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••••••"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-800 outline-none focus:border-emerald-500/50 transition-all font-mono text-lg border-l-4 border-l-transparent focus:border-l-emerald-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verify Secret
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-gray-800 outline-none focus:border-emerald-500/50 transition-all font-mono text-lg border-l-4 border-l-transparent focus:border-l-emerald-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 text-left">
                                    <button
                                        type="submit"
                                        disabled={savingPassword || !newPassword}
                                        className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#10B981] hover:text-white hover:shadow-2xl hover:shadow-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                    >
                                        {savingPassword ? <div className="w-5 h-5 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" /> : <Lock className="w-5 h-5" />}
                                        {savingPassword ? 'Syncing Vault...' : 'Rotate Credentials'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ── PREFERENCES TAB ── */}
                {activeTab === 'preferences' && (
                    <motion.div
                        key="preferences"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Notifications Card */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-5 mb-10 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/10">
                                    <Bell className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Alert Preferences</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mt-1">Configure internal notification hooks</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Email Notifications Section */}
                                <div className="py-6 border-b border-white/10 space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex-1 text-left">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <p className="text-lg font-black text-white tracking-tight">Email Correspondence Alerts</p>
                                                {emailConfigured ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                                        <CheckCircle2 className="w-3 h-3" /> System Live
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400 uppercase tracking-widest">
                                                        <XCircle className="w-3 h-3" /> Config Required
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#94A3B8] font-medium leading-relaxed max-w-xl">
                                                Direct email pipeline for real-time stakeholder inquiries. Requires valid Resend identification secrets.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleEmail(!localPrefs.emailNotifications)}
                                            className={`self-start sm:self-center shrink-0 relative w-14 h-8 rounded-full transition-all duration-500 ${localPrefs.emailNotifications ? 'bg-[#10B981] shadow-lg shadow-emerald-500/20' : 'bg-white/10 border border-white/5'}`}
                                        >
                                            <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ease-spring ${localPrefs.emailNotifications ? 'left-7.5 translate-x-0' : 'left-1.5'}`} />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {(showEmailForm || (localPrefs.emailNotifications && !emailConfigured) || (localPrefs.emailNotifications && emailConfigured)) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-[32px] space-y-8 mt-2">
                                                    <div className="flex items-center gap-3 mb-2 text-left">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                            <Mail className="w-4 h-4 text-emerald-500" />
                                                        </div>
                                                        <p className="text-sm font-black text-white uppercase tracking-widest">Pipeline Integration</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                                                <Key className="w-3.5 h-3.5 text-emerald-500" /> Resend Token
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={showApiKey ? 'text' : 'password'}
                                                                    value={emailConfig.resend_api_key}
                                                                    onChange={(e) => setEmailConfig(c => ({ ...c, resend_api_key: e.target.value }))}
                                                                    placeholder="re_••••••••••••••••"
                                                                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm placeholder:text-gray-800 outline-none focus:border-emerald-500/50 font-mono"
                                                                />
                                                                <button type="button" onClick={() => setShowApiKey(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest">
                                                                    {showApiKey ? 'Hide' : 'Reveal'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Routing Destination</label>
                                                            <input
                                                                type="email"
                                                                value={emailConfig.admin_email}
                                                                onChange={(e) => setEmailConfig(c => ({ ...c, admin_email: e.target.value }))}
                                                                placeholder="alerts@lof.org"
                                                                className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm placeholder:text-gray-800 outline-none focus:border-emerald-500/50 font-medium"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-white/5">
                                                        <button
                                                            onClick={handleSaveEmailConfig}
                                                            disabled={savingEmail}
                                                            className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                                                        >
                                                            {savingEmail ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                                            Sync Pipeline
                                                        </button>
                                                        {emailConfigured && (
                                                            <button
                                                                onClick={handleTestEmail}
                                                                disabled={testingEmail}
                                                                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 transition-all active:scale-[0.98]"
                                                            >
                                                                {testingEmail ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                                                                Execute Test Send
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Browser Notifications Section */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 py-6">
                                    <div className="flex-1 text-left">
                                        <p className="text-lg font-black text-white tracking-tight mb-2">Native System Hooks</p>
                                        <p className="text-sm text-[#94A3B8] font-medium leading-relaxed max-w-xl">
                                            Push notifications delivered directly to OS notification stack for immediate stakeholder response.
                                        </p>
                                        <div className="mt-4">
                                            {browserPermission === 'granted' && (
                                                <span className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Channel Live • Delivery Confirmed
                                                </span>
                                            )}
                                            {browserPermission === 'denied' && (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-lg">
                                                    <p className="text-xs text-red-500 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                        <Activity className="w-3.5 h-3.5" /> Hardware Inaccessible
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                        OS Access blocked. Enable via <strong className="text-white">🔒 Settings</strong> menu in your browser agent to restore hooks.
                                                    </p>
                                                </div>
                                            )}
                                            {browserPermission === 'default' && (
                                                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-[0.1em]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700" /> Awaiting Hardware Authorization
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleToggleBrowserNotifications}
                                        disabled={browserPermission === 'denied'}
                                        className={`self-start sm:self-center shrink-0 relative w-14 h-8 rounded-full transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed ${localPrefs.browserNotifications && browserPermission === 'granted' ? 'bg-[#10B981] shadow-lg shadow-emerald-500/20' : 'bg-white/10 border border-white/5'}`}
                                    >
                                        <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ease-spring ${localPrefs.browserNotifications && browserPermission === 'granted' ? 'left-7.5' : 'left-1.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Display & Region Card */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-5 mb-10 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                    <Globe className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Geo & Temporal Settings</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mt-1">Localization and chronological formatting</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Temporal Indexing Format</label>
                                    <div className="relative">
                                        <select
                                            value={localPrefs.dateFormat}
                                            onChange={(e) => setLocalPrefs(p => ({ ...p, dateFormat: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white outline-none appearance-none font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-white/[0.08] transition-all"
                                        >
                                            <option value="DD/MM/YYYY" className="bg-gray-900">DD/MM/YYYY (Intl)</option>
                                            <option value="MM/DD/YYYY" className="bg-gray-900">MM/DD/YYYY (US)</option>
                                            <option value="YYYY-MM-DD" className="bg-gray-900">YYYY-MM-DD (ISO)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest px-2">Applied globally to all system records</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Operational Timezone</label>
                                    <div className="relative">
                                        <select
                                            value={localPrefs.timezone}
                                            onChange={(e) => setLocalPrefs(p => ({ ...p, timezone: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4.5 text-white outline-none appearance-none font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-white/[0.08] transition-all"
                                        >
                                            <option value="Africa/Lagos" className="bg-gray-900 text-sm">Lagos (WAT, UTC+1)</option>
                                            <option value="UTC" className="bg-gray-900 text-sm">UTC (Global Standard)</option>
                                            <option value="Europe/London" className="bg-gray-900 text-sm">London (GMT)</option>
                                            <option value="America/New_York" className="bg-gray-900 text-sm">NYC (EST)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-emerald-500/[0.03] rounded-xl border border-emerald-500/10">
                                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                                        <span className="text-[11px] text-[#10B981] font-mono font-black tracking-widest">{liveTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Persist Button */}
                        <div className="flex justify-start md:justify-end pt-4">
                            <button
                                onClick={handleSavePreferences}
                                disabled={savingPrefs}
                                className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-[#10B981] rounded-2xl text-white font-black uppercase tracking-[0.3em] text-xs hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] disabled:opacity-50 transition-all active:scale-[0.98] group"
                            >
                                {savingPrefs ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                {savingPrefs ? 'Syncing...' : 'Commit Preferences'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
