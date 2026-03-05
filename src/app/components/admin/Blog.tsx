import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, Search, X, Save, Image as ImageIcon, Type, User, Tag, Layout, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { SkeletonLoader } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

export function Blog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        category: 'Story',
        image_url: '',
        tags: [] as string[]
    });

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error: any) {
            toast.error('Failed to load posts: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const openForm = (post: any = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                author: post.author,
                category: post.category,
                image_url: post.image_url,
                tags: post.tags || []
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                author: '',
                category: 'Story',
                image_url: '',
                tags: []
            });
        }
        setIsFormOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const postData = {
                ...formData,
                published_at: new Date().toISOString()
            };

            let error;
            if (editingPost) {
                const { error: updateError } = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', editingPost.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('blog_posts')
                    .insert([postData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(editingPost ? 'Story updated successfully' : 'New story published!');
            setIsFormOpen(false);
            loadPosts();
        } catch (error: any) {
            toast.error('Save failed: ' + error.message);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) { toast.error('Image must be under 5MB'); return; }
        setIsUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const filename = `blog-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filename, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filename);
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
            const { error } = await supabase.from('blog_posts').delete().eq('id', deleteModal.id);
            if (error) throw error;
            toast.success('Post deleted successfully');
            setPosts(posts.filter(p => p.id !== deleteModal.id));
        } catch (error: any) {
            toast.error('Delete failed: ' + error.message);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Blog Management</h1>
                    <p className="text-sm text-[#94A3B8]">Manage foundation stories and news updates.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter stories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => openForm()}
                        className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="whitespace-nowrap">New Story</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                    { label: 'Total Stories', value: posts.length },
                    { label: 'Live Posts', value: posts.length },
                    { label: 'Categories', value: Array.from(new Set(posts.map(p => p.category))).length || 0 },
                    { label: 'Status', value: 'Active' },
                ].map((stat) => (
                    <div key={stat.label} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 border-l-2 md:border-l-4 border-l-emerald-500 text-left overflow-hidden">
                        <div className="text-xl md:text-2xl font-bold text-white mb-1 tracking-tight truncate">{stat.value}</div>
                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest truncate">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            {filteredPosts.length === 0 ? (
                <EmptyState
                    title="No stories found"
                    description={searchTerm ? 'Try adjusting your search filter.' : 'Start your foundation journey by creating your first blog post.'}
                    actionLabel={searchTerm ? 'Clear Search' : 'Create First Post'}
                    onAction={() => searchTerm ? setSearchTerm('') : openForm()}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onMouseEnter={() => setHoveredCard(post.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:bg-white/10 transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Featured Image */}
                            <div className="relative h-48 sm:h-56 bg-[#0B0E14] group-hover:bg-black transition-colors overflow-hidden border-b border-white/5 text-left shrink-0">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold text-4xl select-none">LOF</div>
                                )}

                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-emerald-500/90 backdrop-blur-md text-white shadow-lg border border-white/10">
                                        {post.category || 'Foundation'}
                                    </span>
                                </div>

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => openForm(post)}
                                        className="p-3 bg-[#10B981] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                                        title="Edit Story"
                                    >
                                        <Edit className="w-5 h-5 text-white" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(post.id)}
                                        className="p-3 bg-red-500 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                                        title="Delete Story"
                                    >
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Detail */}
                            <div className="p-5 md:p-6 flex flex-col flex-1">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors text-left">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-[#94A3B8] mb-6 line-clamp-3 leading-relaxed text-left flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500 shrink-0">
                                            {post.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className="text-xs font-bold text-white truncate">{post.author}</div>
                                            <div className="text-[10px] text-gray-500 font-medium">{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => openForm(post)} className="p-2 sm:hidden bg-white/5 rounded-lg border border-white/10">
                                        <Edit className="w-3.5 h-3.5 text-emerald-500" />
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
                                        {editingPost ? 'Edit Story' : 'New Story'}
                                    </h2>
                                    <p className="text-xs md:text-sm text-[#94A3B8] font-medium tracking-wide">Document the impact and news of L.O.F</p>
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
                                <form onSubmit={handleSave} id="blog-form" className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Type className="w-3.5 h-3.5 text-emerald-500" /> Story Title
                                                </label>
                                                <input
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="Enter a compelling title..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Layout className="w-3.5 h-3.5 text-emerald-500" /> Short Excerpt
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.excerpt}
                                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                    placeholder="A brief summary for the preview card..."
                                                    rows={3}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none font-medium leading-relaxed border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-emerald-500" /> Author Name
                                                </label>
                                                <input
                                                    required
                                                    value={formData.author}
                                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                    placeholder="Who is documenting this?"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-medium border-l-2 border-l-transparent focus:border-l-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Tag className="w-3.5 h-3.5 text-emerald-500" /> Category
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none font-medium cursor-pointer"
                                                    >
                                                        <option value="Story" className="bg-[#0B0E14]">Foundation Story</option>
                                                        <option value="Event" className="bg-[#0B0E14]">Official Event</option>
                                                        <option value="Update" className="bg-[#0B0E14]">Mission Update</option>
                                                        <option value="Impact" className="bg-[#0B0E14]">Impact Report</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                        <Search className="w-4 h-4 rotate-90" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 text-left">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Featured Image
                                                </label>
                                                {/* Upload Button */}
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

                                            {/* Preview Image */}
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

                                    {/* Full Content */}
                                    <div className="space-y-2.5 pt-6 border-t border-white/5 text-left">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Story Content</label>
                                        <textarea
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="Tell the full story here... Use Markdown for formatting if needed."
                                            className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-6 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 resize-none font-serif leading-relaxed text-lg min-h-[300px] border-l-2 border-l-transparent focus:border-l-emerald-500"
                                        />
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
                                        form="blog-form"
                                        className="w-full sm:flex-[2] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold hover:shadow-2xl hover:shadow-emerald-500/40 transition-all active:scale-95"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>{editingPost ? 'Update & Sync' : 'Publish Story'}</span>
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
                title="Delete Blog Post?"
                message="Are you sure you want to remove this story? This action will permanently delete it from the website and cannot be undone."
                confirmLabel="Delete Post"
                variant="danger"
            />
        </div>
    );
}
