import { useState, useEffect, useRef } from 'react';
import { Plus, MapPin, Calendar, Users, TrendingUp, Edit, Trash2, X, Save, Type, Layout, ImageIcon, Activity, ChevronDown, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

const categoryColors: Record<string, string> = {
    Education: 'from-purple-500 to-pink-500',
    Health: 'from-red-500 to-rose-500',
    Environment: 'from-green-500 to-emerald-500',
    Empowerment: 'from-amber-500 to-orange-500',
    Relief: 'from-blue-500 to-cyan-500',
    Default: 'from-indigo-500 to-violet-500',
};

export function Initiatives() {
    const [initiatives, setInitiatives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'Ongoing' | 'Past' | 'Upcoming'>('all');

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingInitiative, setEditingInitiative] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        key_objectives: '',
        image_url: '',
        impact_summary: '',
        category: 'Education',
        status: 'Ongoing'
    });

    useEffect(() => {
        loadInitiatives();
    }, []);

    async function loadInitiatives() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('initiatives')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInitiatives(data || []);
        } catch (error: any) {
            toast.error('Failed to load initiatives: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const openForm = (initiative: any = null) => {
        if (initiative) {
            setEditingInitiative(initiative);
            setFormData({
                title: initiative.title,
                description: initiative.description,
                content: initiative.content || '',
                key_objectives: Array.isArray(initiative.key_objectives)
                    ? initiative.key_objectives.join(', ')
                    : (initiative.key_objectives || ''),
                image_url: initiative.image_url,
                impact_summary: initiative.impact_summary || '',
                category: initiative.category,
                status: initiative.status
            });
        } else {
            setEditingInitiative(null);
            setFormData({
                title: '',
                description: '',
                content: '',
                key_objectives: '',
                image_url: '',
                impact_summary: '',
                category: 'Education',
                status: 'Ongoing'
            });
        }
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let error;
            if (editingInitiative) {
                const { error: updateError } = await supabase
                    .from('initiatives')
                    .update(formData)
                    .eq('id', editingInitiative.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('initiatives')
                    .insert([formData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(editingInitiative ? 'Initiative updated' : 'New initiative launched!');
            setIsFormOpen(false);
            loadInitiatives();
        } catch (error: any) {
            toast.error('Save failed: ' + error.message);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        setIsUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const filename = `initiative-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('initiatives-images')
                .upload(filename, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('initiatives-images').getPublicUrl(filename);
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success('Image uploaded!');
        } catch (err: any) {
            toast.error('Upload failed: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            const { error } = await supabase.from('initiatives').delete().eq('id', deleteModal.id);
            if (error) throw error;
            toast.success('Initiative deleted permanently');
            setInitiatives(initiatives.filter(i => i.id !== deleteModal.id));
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    const filteredInitiatives = filter === 'all'
        ? initiatives
        : initiatives.filter(i => i.status === filter);

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Initiatives Management</h1>
                    <p className="text-sm text-[#94A3B8]">Track and manage foundation programs and impact projects.</p>
                </div>
                <button
                    onClick={() => openForm()}
                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span className="whitespace-nowrap">New Initiative</span>
                </button>
            </div>

            {/* Filters - Horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                {['all', 'Ongoing', 'Past', 'Upcoming'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 whitespace-nowrap ${filter === f
                            ? 'bg-[#10B981] border-[#10B981] text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {f} ({f === 'all' ? initiatives.length : initiatives.filter(i => i.status === f).length})
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredInitiatives.length === 0 ? (
                <EmptyState
                    title="No initiatives found"
                    description="You haven't added any programs to this category yet."
                    actionLabel="Add Initiative"
                    onAction={() => openForm()}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {filteredInitiatives.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-5 md:p-8 hover:bg-white/10 transition-all duration-500 text-left flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-6 gap-4">
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                                            {item.title}
                                        </h3>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${item.status === 'Ongoing' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                                            item.status === 'Past' ? 'bg-white/10 text-gray-400 border border-white/10' :
                                                'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-[20px] flex items-center justify-center bg-gradient-to-br ${categoryColors[item.category as keyof typeof categoryColors] || categoryColors.Default} shadow-xl shadow-black/20`}>
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                                {item.description}
                            </p>

                            {/* Impact Callout */}
                            <div className="mb-8 p-5 rounded-[24px] bg-white/5 border border-white/10 border-l-[6px] border-l-emerald-500 shadow-xl">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1.5">Verified Legacy Impact</div>
                                <div className="text-base md:text-lg font-black text-white uppercase tracking-tight">{item.impact_summary || 'Tracking Milestone...'}</div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-wrap items-center justify-between pt-6 border-t border-white/10 mt-auto gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openForm(item)}
                                        className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl text-white"
                                        title="Edit Initiative"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(item.id)}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl text-red-500 hover:text-white"
                                        title="Archive"
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
                                        {editingInitiative ? 'Update Initiative' : 'Launch New Initiative'}
                                    </h2>
                                    <p className="text-xs md:text-sm text-[#94A3B8] font-medium tracking-wide">Define the mission, category, and impact goals of this program.</p>
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
                                <form onSubmit={handleSave} id="initiative-form" className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Type className="w-3.5 h-3.5 text-emerald-500" /> Program Title
                                                </label>
                                                <input
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="e.g. Clean Water Project"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Layout className="w-3.5 h-3.5 text-emerald-500" /> Mission Goals
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Detail the scope and target of this project..."
                                                    rows={5}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Cover Image
                                                </label>
                                                {/* Upload zone */}
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full flex items-center gap-4 p-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                                                >
                                                    {isUploading ? (
                                                        <><Loader2 className="w-5 h-5 text-emerald-500 animate-spin" /><span className="text-sm text-gray-400">Uploading...</span></>
                                                    ) : (
                                                        <><Upload className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors" /><div className="text-left"><p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Upload from device</p><p className="text-[10px] text-gray-600">PNG, JPG, WebP — Max 5MB</p></div></>
                                                    )}
                                                </div>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                {/* OR divider */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-px bg-white/10" />
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">or paste URL</span>
                                                    <div className="flex-1 h-px bg-white/10" />
                                                </div>
                                                <input
                                                    value={formData.image_url}
                                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />

                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Activity className="w-3.5 h-3.5 text-emerald-500" /> Program Status
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.status}
                                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-medium cursor-pointer"
                                                        >
                                                            <option value="Ongoing" className="bg-[#0B0E14]">Ongoing</option>
                                                            <option value="Past" className="bg-[#0B0E14]">Past</option>
                                                            <option value="Upcoming" className="bg-[#0B0E14]">Upcoming</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                            <ChevronDown className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Users className="w-3.5 h-3.5 text-emerald-500" /> Category
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            value={formData.category}
                                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-medium cursor-pointer"
                                                        >
                                                            {Object.keys(categoryColors).filter(k => k !== 'Default').map(cat => (
                                                                <option key={cat} value={cat} className="bg-[#0B0E14]">{cat}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                            <ChevronDown className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Quantifiable Impact
                                                </label>
                                                <input
                                                    required
                                                    value={formData.impact_summary}
                                                    onChange={(e) => setFormData({ ...formData, impact_summary: e.target.value })}
                                                    placeholder="e.g. 5,000+ children helped"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            {/* Preview */}
                                            {formData.image_url && (
                                                <div className="relative aspect-video rounded-[24px] overflow-hidden border border-white/10 group bg-gray-900 shadow-2xl">
                                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 backdrop-blur-md">Live Preview</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Full Content Sections */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                        <div className="space-y-2.5 text-left">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Layout className="w-3.5 h-3.5 text-emerald-500" /> The Vision (Detail Page)
                                            </label>
                                            <textarea
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                placeholder="Detailed description of the initiative's mission and approach..."
                                                rows={5}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                            />
                                            <p className="text-[10px] text-gray-600">Shown as 'The Vision' on the public detail page.</p>
                                        </div>
                                        <div className="space-y-2.5 text-left">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Key Objectives
                                            </label>
                                            <textarea
                                                value={formData.key_objectives}
                                                onChange={(e) => setFormData({ ...formData, key_objectives: e.target.value })}
                                                placeholder="e.g. Sustainable Impact, Community Led, Future Proof, Scalable Solutions"
                                                rows={5}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                            />
                                            <p className="text-[10px] text-gray-600">Separate each objective with a comma. Shown on the public detail page.</p>
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
                                        form="initiative-form"
                                        className="w-full sm:flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all active:scale-95"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingInitiative ? 'Update & Sync' : 'Launch Project'}</span>
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
                title="Delete Initiative?"
                message="Are you sure you want to remove this program? This will permanently delete all associated metrics and impact records from the live site."
                confirmLabel="Delete Initiative"
                variant="danger"
            />
        </div>
    );
}
