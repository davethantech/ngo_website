import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase, MapPin, Building2, CheckCircle, XCircle, X, Save, Type, Layout, List, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

export function Careers() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        department: 'Operations',
        location: 'Remote',
        type: 'Full-time',
        description: '',
        requirements: '',
        benefits: '',
        is_active: true
    });

    useEffect(() => {
        loadCareers();
    }, []);

    async function loadCareers() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error: any) {
            toast.error('Failed to load careers: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const openForm = (job: any = null) => {
        if (job) {
            setEditingJob(job);
            setFormData({
                title: job.title,
                department: job.department,
                location: job.location,
                type: job.type,
                description: job.description,
                requirements: job.requirements
                    ? (Array.isArray(job.requirements)
                        ? job.requirements.join('\n')
                        : String(job.requirements).replace(/^\[|\]$/g, '').split(',').map((s: string) => s.trim().replace(/^"|"$/g, '')).join('\n'))
                    : '',
                benefits: job.benefits
                    ? (Array.isArray(job.benefits)
                        ? job.benefits.join('\n')
                        : String(job.benefits).replace(/^\[|\]$/g, '').split(',').map((s: string) => s.trim().replace(/^"|"$/g, '')).join('\n'))
                    : '',
                is_active: job.is_active
            });
        } else {
            setEditingJob(null);
            setFormData({
                title: '',
                department: 'Operations',
                location: 'Remote',
                type: 'Full-time',
                description: '',
                requirements: '',
                benefits: '',
                is_active: true
            });
        }
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.trim(),
                benefits: formData.benefits.trim()
            };

            let error;
            if (editingJob) {
                const { error: updateError } = await supabase
                    .from('careers')
                    .update(payload)
                    .eq('id', editingJob.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('careers')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(editingJob ? 'Listing updated' : 'New role published!');
            setIsFormOpen(false);
            loadCareers();
        } catch (error: any) {
            toast.error('Save failed: ' + error.message);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            const { error } = await supabase.from('careers').delete().eq('id', deleteModal.id);
            if (error) throw error;
            toast.success('Listing deleted permanently');
            setJobs(jobs.filter(j => j.id !== deleteModal.id));
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('careers')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Position ${!currentStatus ? 'Opened' : 'Closed'}`);
            setJobs(jobs.map(j => j.id === id ? { ...j, is_active: !currentStatus } : j));
        } catch (error: any) {
            toast.error('Update failed: ' + error.message);
        }
    };

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Careers Portal</h1>
                    <p className="text-sm text-[#94A3B8]">Manage opportunities within the L.O.F family.</p>
                </div>
                <button
                    onClick={() => openForm()}
                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span className="whitespace-nowrap">Add Position</span>
                </button>
            </div>

            {/* Grid */}
            {jobs.length === 0 ? (
                <EmptyState
                    title="No vacancies listed"
                    description="Grow your foundation team by posting your first opportunity."
                    actionLabel="Post Role"
                    onAction={() => openForm()}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 hover:bg-white/10 transition-all duration-500 text-left flex flex-col"
                        >
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-6">
                                <div className="flex items-start gap-5 flex-1 overflow-hidden">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                        <Briefcase className="w-7 h-7 md:w-8 md:h-8" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="text-xl md:text-2xl font-black text-white mb-2.5 group-hover:text-emerald-400 transition-colors truncate">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                                                {job.department}
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                                {job.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStatus(job.id, job.is_active)}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all self-end sm:self-start shrink-0 ${job.is_active
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-500'
                                        : 'bg-white/5 text-gray-500 border-white/10'
                                        }`}
                                >
                                    {job.is_active ? 'Active' : 'Archived'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="p-5 rounded-[24px] bg-white/5 border border-white/10 flex flex-col">
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1.5">Position Type</div>
                                    <div className="text-sm font-bold text-white uppercase">{job.type}</div>
                                </div>
                                <div className="p-5 rounded-[24px] bg-white/5 border border-white/10 flex flex-col">
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1.5">Applications</div>
                                    <div className="text-sm font-bold text-white uppercase">Secure Portal</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                                <div className="text-[11px] text-[#94A3B8] font-medium leading-relaxed truncate max-w-[200px] opacity-60">
                                    {job.description}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => openForm(job)}
                                        className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl text-white"
                                        title="Modify"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(job.id)}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl text-red-500 hover:text-white"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-h-[100dvh] sm:my-8 sm:max-h-[92vh] sm:max-w-4xl bg-[#0B0E14] sm:border sm:border-white/10 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden mx-auto"
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                                <div className="text-left pr-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
                                        {editingJob ? 'Edit Career Listing' : 'Post New Opportunity'}
                                    </h2>
                                    <p className="text-xs md:text-sm text-[#94A3B8] font-medium tracking-wide">Find the best talent to join the foundation's mission.</p>
                                </div>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all active:scale-95"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                                <form onSubmit={handleSave} id="career-form" className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                        <div className="space-y-6">
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Type className="w-3.5 h-3.5 text-emerald-500" /> Professional Title
                                                </label>
                                                <input
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="e.g. Program Coordinator"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Department
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.department}
                                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none appearance-none font-medium cursor-pointer"
                                                        >
                                                            <option value="Operations" className="bg-[#0B0E14]">Operations</option>
                                                            <option value="Fundraising" className="bg-[#0B0E14]">Fundraising</option>
                                                            <option value="Outreach" className="bg-[#0B0E14]">Outreach</option>
                                                            <option value="Technical" className="bg-[#0B0E14]">Technical</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Location
                                                    </label>
                                                    <input
                                                        required
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                        placeholder="e.g. Lagos, NG / Remote"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Layout className="w-3.5 h-3.5 text-emerald-500" /> Public Description
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Role overview for potential candidates..."
                                                    rows={5}
                                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-white outline-none resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <List className="w-3.5 h-3.5 text-emerald-500" /> Hard Requirements (one/line)
                                                </label>
                                                <textarea
                                                    value={formData.requirements}
                                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                                    placeholder="5+ years experience&#10;Bachelor's degree..."
                                                    rows={5}
                                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-white outline-none resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Plus className="w-3.5 h-3.5 text-emerald-500" /> Perks & Benefits (one/line)
                                                </label>
                                                <textarea
                                                    value={formData.benefits}
                                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                                    placeholder="Health insurance&#10;Remote flexibility..."
                                                    rows={5}
                                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-white outline-none resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="flex items-center gap-4 p-5 md:p-6 bg-white/[0.03] border border-white/10 rounded-[24px] text-left">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        id="is_active"
                                                        checked={formData.is_active}
                                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-white/10 transition-all checked:border-[#10B981] checked:bg-[#10B981]"
                                                    />
                                                    <CheckCircle className="pointer-events-none absolute left-1 top-1 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                                                </div>
                                                <div>
                                                    <label htmlFor="is_active" className="text-sm font-black text-white uppercase tracking-wider cursor-pointer select-none">
                                                        Listing Visibility
                                                    </label>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Allow public applications</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 md:p-10 border-t border-white/5 bg-white/[0.02] shrink-0">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="w-full sm:flex-1 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        form="career-form"
                                        className="w-full sm:flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all active:scale-95"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingJob ? 'Sync Listing' : 'Publish Position'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Job Listing?"
                message="Are you sure you want to remove this position? This will permanently close the role and delete all associated data from the live portal."
                confirmLabel="Delete Listing"
                variant="danger"
            />
        </div>
    );
}
