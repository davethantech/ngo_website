import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle, MailOpen, Clock, Archive, Inbox as InboxIcon, RotateCcw, Calendar, User, CornerUpLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

export function Inbox() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState<'Active' | 'Archived'>('Active');

    // Modal state
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    useEffect(() => {
        loadSubmissions();
    }, []);

    async function loadSubmissions() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions(data || []);
        } catch (error: any) {
            toast.error('Failed to load inbox: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('contact_submissions')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            toast.success(status === 'Archived' ? 'Message moved to Archive' : `Message marked as ${status}`);
            setSubmissions(submissions.map(s => s.id === id ? { ...s, status } : s));
        } catch (error: any) {
            toast.error('Update failed: ' + error.message);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            const { error } = await supabase.from('contact_submissions').delete().eq('id', deleteModal.id);
            if (error) throw error;
            toast.success('Message deleted permanently');
            setSubmissions(submissions.filter(s => s.id !== deleteModal.id));
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    const filtered = submissions.filter(s => {
        const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = currentTab === 'Active'
            ? s.status !== 'Archived'
            : s.status === 'Archived';

        return matchesSearch && matchesTab;
    });

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Stakeholder Communications</h1>
                    <p className="text-xs md:text-sm text-[#94A3B8] font-medium font-medium">Manage and process inquiries from the global community.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative group flex-1 sm:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search correspondence..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-72 pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation & Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shrink-0">
                    <button
                        onClick={() => setCurrentTab('Active')}
                        className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${currentTab === 'Active'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <InboxIcon className="w-4 h-4" />
                        Inbox ({submissions.filter(s => s.status !== 'Archived').length})
                    </button>
                    <button
                        onClick={() => setCurrentTab('Archived')}
                        className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${currentTab === 'Archived'
                            ? 'bg-gray-600 text-white shadow-lg border border-white/10'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Archive className="w-4 h-4" />
                        Archive ({submissions.filter(s => s.status === 'Archived').length})
                    </button>
                </div>

                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center gap-2 px-4"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset Search
                    </button>
                )}
            </div>

            {/* Message List */}
            {filtered.length === 0 ? (
                <EmptyState
                    title={currentTab === 'Active' ? "Clear Skies" : "Archive Empty"}
                    description={searchTerm ? "No inquiries found matching your search criteria." : currentTab === 'Active' ? "You're all caught up! No active inquiries require attention." : "Your communication archive is currently empty."}
                    actionLabel={searchTerm ? 'Reset Filter' : undefined}
                    onAction={() => searchTerm ? setSearchTerm('') : null}
                />
            ) : (
                <div className="overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px]">
                    <div className="grid grid-cols-1 divide-y divide-white/10">
                        {filtered.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group p-6 md:p-8 hover:bg-white/[0.03] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative border-l-4 ${msg.status === 'New' && currentTab === 'Active' ? 'border-l-emerald-500 bg-emerald-500/[0.02]' : 'border-l-transparent'
                                    }`}
                            >
                                <div className="flex items-start gap-6 flex-1 min-w-0">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform duration-500 group-hover:scale-110 ${msg.status === 'New' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/5' : 'bg-white/5 border-white/5 text-gray-600'
                                        }`}>
                                        {msg.status === 'New' ? <Mail className="w-6 h-6" /> : <MailOpen className="w-6 h-6" />}
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <User className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                <span className="text-sm font-black text-white truncate max-w-[150px]">{msg.full_name}</span>
                                            </div>
                                            <span className="text-gray-700 hidden sm:inline">•</span>
                                            <span className="text-xs text-gray-500 truncate font-medium">{msg.email}</span>
                                        </div>
                                        <div className="text-lg font-black text-white mb-2 leading-tight tracking-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{msg.subject}</div>
                                        <p className="text-sm text-[#94A3B8] line-clamp-2 max-w-4xl leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center justify-end gap-6 shrink-0 lg:pl-10">
                                    <div className="flex flex-col items-start sm:items-end justify-center shrink-0">
                                        <div className="flex items-center gap-2 mb-1 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                            <Clock className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3">
                                            <Calendar className="w-3 h-3 text-gray-600" />
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{new Date(msg.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        {currentTab === 'Active' ? (
                                            <>
                                                {msg.status === 'New' && (
                                                    <button
                                                        onClick={() => updateStatus(msg.id, 'Read')}
                                                        className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl text-white border border-emerald-400/20"
                                                        title="Resolve/Mark Read"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => updateStatus(msg.id, 'Archived')}
                                                    className="p-3 bg-white/5 rounded-2xl hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all text-white border border-white/10"
                                                    title="Archive Message"
                                                >
                                                    <Archive className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => updateStatus(msg.id, 'Read')}
                                                className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl text-white border border-emerald-400/20"
                                                title="Return to Inbox"
                                            >
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => confirmDelete(msg.id)}
                                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl text-red-500 hover:text-white"
                                            title="Delete File"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Purge Communication Record?"
                message="This will permanently delete the stakeholder inquiry from the high-availability database. This action is irreversible."
                confirmLabel="Delete Permanently"
                variant="danger"
            />
        </div>
    );
}
