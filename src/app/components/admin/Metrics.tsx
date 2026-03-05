import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Hash, GripVertical, X, Save, Type, ListOrdered, BarChart3, Heart, Users, MapPin, GraduationCap, Stethoscope, Briefcase, Quote, Image as ImageIcon, UserCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

const AVAILABLE_ICONS = [
    { name: 'Users', icon: Users },
    { name: 'Heart', icon: Heart },
    { name: 'MapPin', icon: MapPin },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'BarChart3', icon: BarChart3 },
];

export function Metrics() {
    const [activeTab, setActiveTab] = useState<'counters' | 'stories'>('counters');
    const [metrics, setMetrics] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    // Form states
    const [metricData, setMetricData] = useState({
        label: '',
        value: '',
        icon_name: 'Users',
        display_order: 0
    });

    const [storyData, setStoryData] = useState({
        quote: '',
        author: '',
        role: '',
        image_url: '',
        display_order: 0
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    async function loadData() {
        try {
            setLoading(true);
            if (activeTab === 'counters') {
                const { data, error } = await supabase
                    .from('impact_metrics')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (error) throw error;
                setMetrics(data || []);
            } else {
                const { data, error } = await supabase
                    .from('impact_stories')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (error) throw error;
                setStories(data || []);
            }
        } catch (error: any) {
            toast.error('Failed to load data: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const openForm = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            if (activeTab === 'counters') {
                setMetricData({
                    label: item.label,
                    value: item.value,
                    icon_name: item.icon_name || 'Users',
                    display_order: item.display_order
                });
            } else {
                setStoryData({
                    quote: item.quote,
                    author: item.author,
                    role: item.role,
                    image_url: item.image_url,
                    display_order: item.display_order
                });
            }
        } else {
            setEditingItem(null);
            if (activeTab === 'counters') {
                setMetricData({
                    label: '',
                    value: '',
                    icon_name: 'Users',
                    display_order: metrics.length
                });
            } else {
                setStoryData({
                    quote: '',
                    author: '',
                    role: '',
                    image_url: '',
                    display_order: stories.length
                });
            }
        }
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const table = activeTab === 'counters' ? 'impact_metrics' : 'impact_stories';
            const payload = activeTab === 'counters' ? metricData : storyData;

            let error;
            if (editingItem) {
                const { error: updateError } = await supabase
                    .from(table)
                    .update(payload)
                    .eq('id', editingItem.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from(table)
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(editingItem ? 'Updated successfully' : 'Added successfully');
            setIsFormOpen(false);
            loadData();
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
            const table = activeTab === 'counters' ? 'impact_metrics' : 'impact_stories';
            const { error } = await supabase.from(table).delete().eq('id', deleteModal.id);
            if (error) throw error;
            toast.success('Permanently removed');
            if (activeTab === 'counters') {
                setMetrics(metrics.filter(m => m.id !== deleteModal.id));
            } else {
                setStories(stories.filter(s => s.id !== deleteModal.id));
            }
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Impact Analytics</h1>
                    <p className="text-sm text-[#94A3B8]">Manage the metrics and stories that define foundation impact.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 shrink-0">
                        <button
                            onClick={() => setActiveTab('counters')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'counters' ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            Counters
                        </button>
                        <button
                            onClick={() => setActiveTab('stories')}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all ${activeTab === 'stories' ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            Impact Stories
                        </button>
                    </div>

                    <button
                        onClick={() => openForm()}
                        className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="whitespace-nowrap">{activeTab === 'counters' ? 'New Metric' : 'New Story'}</span>
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <AnimatePresence mode="wait">
                {activeTab === 'counters' ? (
                    <motion.div
                        key="counters"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    >
                        {metrics.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    title="No counters found"
                                    description="Start by adding your first impact metric."
                                    actionLabel="Add Metric"
                                    onAction={() => openForm()}
                                />
                            </div>
                        ) : (
                            metrics.map((metric, index) => {
                                const IconComponent = AVAILABLE_ICONS.find(i => i.name === metric.icon_name)?.icon || Hash;
                                return (
                                    <motion.div
                                        key={metric.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-6 hover:bg-white/10 transition-all duration-500 text-left flex flex-col"
                                    >
                                        <div className="flex items-start justify-between mb-8 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                                    <IconComponent className="w-7 h-7 md:w-8 md:h-8" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Target Area</div>
                                                    <div className="text-lg md:text-xl font-black text-white truncate">{metric.label}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative py-8 px-6 bg-white/[0.03] rounded-[28px] border border-white/5 border-dashed mb-8 flex flex-col items-center justify-center overflow-hidden group/value">
                                            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover/value:opacity-100 transition-opacity" />
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2.5">Real-time Verified</div>
                                            <div className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                                                {metric.value}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                                                Index: {metric.display_order}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openForm(metric)}
                                                    className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl text-white"
                                                    title="Modify"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(metric.id)}
                                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl text-red-500 hover:text-white"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="stories"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                    >
                        {stories.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    title="No stories found"
                                    description="Human stories bring the impact numbers to life."
                                    actionLabel="Add Story"
                                    onAction={() => openForm()}
                                />
                            </div>
                        ) : (
                            stories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 hover:bg-white/10 transition-all duration-500 text-left flex flex-col"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                        <div className="w-24 h-24 rounded-[28px] overflow-hidden border-2 border-emerald-500/30 flex-shrink-0 shadow-2xl relative self-start sm:self-center">
                                            <img src={story.image_url} alt={story.author} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-emerald-500/10" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-xl md:text-2xl font-black text-white mb-1.5 group-hover:text-emerald-400 transition-colors">{story.author}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                                    {story.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative mb-8 flex-grow">
                                        <Quote className="absolute -top-4 -left-3 w-10 h-10 text-emerald-500/10 -rotate-12" />
                                        <p className="text-base md:text-lg text-[#94A3B8] italic leading-relaxed font-serif pl-4 pr-2 relative z-10 selection:bg-emerald-500/30">
                                            "{story.quote}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                                            Display Index: {story.display_order}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openForm(story)}
                                                className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl text-white"
                                                title="Modify"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(story.id)}
                                                className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl text-red-500 hover:text-white"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shared Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-h-[100dvh] sm:my-8 sm:max-h-[92vh] sm:max-w-2xl bg-[#0B0E14] sm:border sm:border-white/10 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden mx-auto"
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                                <div className="text-left pr-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
                                        {editingItem ? 'Edit Entry' : 'New Impact Record'}
                                    </h2>
                                    <p className="text-xs md:text-sm text-[#94A3B8] font-medium tracking-wide">
                                        {activeTab === 'counters' ? 'Update live impact statistics.' : 'Share a message of change from a beneficiary.'}
                                    </p>
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
                                <form onSubmit={handleSave} id="metrics-form" className="space-y-8">
                                    {activeTab === 'counters' ? (
                                        <>
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Type className="w-3.5 h-3.5 text-emerald-500" /> Area Of Impact
                                                </label>
                                                <input
                                                    required
                                                    value={metricData.label}
                                                    onChange={(e) => setMetricData({ ...metricData, label: e.target.value })}
                                                    placeholder="e.g. Scholarship Students"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <BarChart3 className="w-3.5 h-3.5 text-emerald-500" /> Numeric Value (inc. symbols)
                                                    </label>
                                                    <input
                                                        required
                                                        value={metricData.value}
                                                        onChange={(e) => setMetricData({ ...metricData, value: e.target.value })}
                                                        placeholder="e.g. 5,000+"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-black tracking-tight border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                    />
                                                </div>
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <ListOrdered className="w-3.5 h-3.5 text-emerald-500" /> Display Index
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={metricData.display_order}
                                                        onChange={(e) => setMetricData({ ...metricData, display_order: parseInt(e.target.value) })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 text-left pt-4 border-t border-white/5">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Iconography Selection</label>
                                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                                    {AVAILABLE_ICONS.map((i) => (
                                                        <button
                                                            key={i.name}
                                                            type="button"
                                                            onClick={() => setMetricData({ ...metricData, icon_name: i.name })}
                                                            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${metricData.icon_name === i.name ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-xl shadow-emerald-500/10' : 'bg-white/5 border-white/5 text-gray-600 hover:border-white/10 hover:text-white'}`}
                                                        >
                                                            <i.icon className="w-5 h-5" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Quote className="w-3.5 h-3.5 text-emerald-500" /> Beneficiary Testimonial
                                                </label>
                                                <textarea
                                                    required
                                                    value={storyData.quote}
                                                    onChange={(e) => setStoryData({ ...storyData, quote: e.target.value })}
                                                    placeholder="Focus on the impact foundation made..."
                                                    rows={5}
                                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-white outline-none resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500 font-serif"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <UserCircle className="w-3.5 h-3.5 text-emerald-500" /> Author Identity
                                                    </label>
                                                    <input
                                                        required
                                                        value={storyData.author}
                                                        onChange={(e) => setStoryData({ ...storyData, author: e.target.value })}
                                                        placeholder="Amina K."
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                    />
                                                </div>
                                                <div className="space-y-2.5 text-left">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Recognition/Status
                                                    </label>
                                                    <input
                                                        required
                                                        value={storyData.role}
                                                        onChange={(e) => setStoryData({ ...storyData, role: e.target.value })}
                                                        placeholder="University Graduate"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Avatar Image URL
                                                </label>
                                                <input
                                                    required
                                                    value={storyData.image_url}
                                                    onChange={(e) => setStoryData({ ...storyData, image_url: e.target.value })}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <ListOrdered className="w-3.5 h-3.5 text-emerald-500" /> Sort Prioritiy
                                                </label>
                                                <input
                                                    type="number"
                                                    value={storyData.display_order}
                                                    onChange={(e) => setStoryData({ ...storyData, display_order: parseInt(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none font-mono"
                                                />
                                            </div>
                                        </>
                                    )}
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
                                        form="metrics-form"
                                        className="w-full sm:flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all active:scale-95"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingItem ? 'Sync Updates' : 'Publish Impact'}</span>
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
                title="Permanently remove item?"
                message="This action cannot be undone. It will be removed from the public impact dashboard immediately."
                confirmLabel="Delete Permanently"
                variant="danger"
            />
        </div>
    );
}
