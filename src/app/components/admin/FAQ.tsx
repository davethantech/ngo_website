import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, HelpCircle, ChevronRight, X, Save, Type, Layout, Tag, ListOrdered } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

export function FAQ() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    // Form state
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General',
        display_order: 0
    });

    useEffect(() => {
        loadFAQ();
    }, []);

    async function loadFAQ() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('faq_items')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (error: any) {
            toast.error('Failed to load FAQ: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const openForm = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                question: item.question,
                answer: item.answer,
                category: item.category,
                display_order: item.display_order
            });
        } else {
            setEditingItem(null);
            setFormData({
                question: '',
                answer: '',
                category: 'General',
                display_order: items.length
            });
        }
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let error;
            if (editingItem) {
                const { error: updateError } = await supabase
                    .from('faq_items')
                    .update(formData)
                    .eq('id', editingItem.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('faq_items')
                    .insert([formData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(editingItem ? 'FAQ updated' : 'New question added!');
            setIsFormOpen(false);
            loadFAQ();
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
            const { error } = await supabase.from('faq_items').delete().eq('id', deleteModal.id);
            if (error) throw error;
            toast.success('FAQ item deleted permanently');
            setItems(items.filter(i => i.id !== deleteModal.id));
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    const categories = ['all', 'General', 'Donations', 'Volunteer', 'Mission', 'Support'];
    const filteredItems = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">FAQ Center</h1>
                    <p className="text-sm text-[#94A3B8]">Manage the questions and answers for stakeholders.</p>
                </div>
                <button
                    onClick={() => openForm()}
                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    <span className="whitespace-nowrap">Add Question</span>
                </button>
            </div>

            {/* Category Pills - Horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border shrink-0 whitespace-nowrap ${activeCategory === cat
                            ? 'bg-[#10B981] border-[#10B981] text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            {filteredItems.length === 0 ? (
                <EmptyState
                    title="No FAQ items found"
                    description="Help stakeholders by adding common questions about the foundation."
                    actionLabel="Add FAQ"
                    onAction={() => openForm()}
                />
            ) : (
                <div className="space-y-3 md:space-y-4">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-[24px] p-5 md:p-6 hover:bg-white/10 transition-all duration-300 text-left"
                        >
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1 overflow-hidden">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                        <HelpCircle className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div className="text-left flex-1 overflow-hidden">
                                        <div className="flex items-center gap-3 mb-2.5">
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                {item.category}
                                            </span>
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border-l border-white/10 pl-3">
                                                Index: {item.display_order}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-snug">
                                            {item.question}
                                        </h3>
                                        <p className="text-sm text-[#94A3B8] leading-relaxed max-w-4xl opacity-80 group-hover:opacity-100 transition-opacity font-medium">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-start">
                                    <button
                                        onClick={() => openForm(item)}
                                        className="p-3 bg-white/5 rounded-2xl hover:bg-[#10B981] transition-all text-white border border-white/10 hover:shadow-lg hover:shadow-emerald-500/20"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(item.id)}
                                        className="p-3 bg-white/5 rounded-2xl hover:bg-red-500 transition-all text-white border border-white/10 hover:shadow-lg hover:shadow-red-500/20"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
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
                            className="relative w-full max-h-[100dvh] sm:my-8 sm:max-h-[92vh] sm:max-w-2xl bg-[#0B0E14] sm:border sm:border-white/10 sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden mx-auto"
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center shrink-0">
                                <div className="text-left pr-8">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
                                        {editingItem ? 'Edit Entry' : 'New Question'}
                                    </h2>
                                    <p className="text-xs md:text-sm text-[#94A3B8] font-medium tracking-wide">Provide clear and concise answers for stakeholders.</p>
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
                                <form onSubmit={handleSave} id="faq-form" className="space-y-6">
                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Type className="w-3.5 h-3.5 text-emerald-500" /> Stakeholder Question
                                        </label>
                                        <input
                                            required
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                            placeholder="e.g. How can I volunteer?"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2.5 text-left">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Layout className="w-3.5 h-3.5 text-emerald-500" /> Official Response
                                        </label>
                                        <textarea
                                            required
                                            value={formData.answer}
                                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                            placeholder="Provide a detailed response..."
                                            rows={6}
                                            className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2.5 text-left">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5 text-emerald-500" /> Knowledge Group
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-medium cursor-pointer"
                                                >
                                                    {categories.filter(c => c !== 'all').map(cat => (
                                                        <option key={cat} value={cat} className="bg-[#0B0E14]">{cat}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 text-left">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <ListOrdered className="w-3.5 h-3.5 text-emerald-500" /> Display Index
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-mono"
                                            />
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
                                        form="faq-form"
                                        className="w-full sm:flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all active:scale-95"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingItem ? 'Save Updates' : 'Publish Entry'}</span>
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
                title="Delete Entry?"
                message="Are you sure you want to remove this question? This will permanently delete it from the stakeholder knowledge base and cannot be undone."
                confirmLabel="Delete Item"
                variant="danger"
            />
        </div>
    );
}
