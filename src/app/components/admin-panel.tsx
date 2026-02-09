import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Image as ImageIcon, Save, Database } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { seedInitialData } from './seed-data';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  impact: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'initiatives'>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch blog posts
      const blogResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/blog-posts`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const blogData = await blogResponse.json();
      if (blogData.success) {
        setBlogPosts(blogData.posts);
      }

      // Fetch initiatives
      const initiativesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/initiatives`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const initiativesData = await initiativesResponse.json();
      if (initiativesData.success) {
        setInitiatives(initiativesData.initiatives);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    if (activeTab === 'blog') {
      setEditingItem({
        id: '',
        title: '',
        content: '',
        excerpt: '',
        author: '',
        category: '',
        imageUrl: '',
        tags: [],
      });
    } else {
      setEditingItem({
        id: '',
        title: '',
        description: '',
        imageUrl: '',
        impact: '',
      });
    }
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const endpoint =
        activeTab === 'blog'
          ? `blog-posts/${id}`
          : `initiatives/${id}`;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/${endpoint}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Item deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleSave = async () => {
    try {
      const isNew = !editingItem.id;
      const endpoint = activeTab === 'blog' ? 'blog-posts' : 'initiatives';
      const url = isNew
        ? `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/${endpoint}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/${endpoint}/${editingItem.id}`;

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(editingItem),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Item ${isNew ? 'created' : 'updated'} successfully`);
        setIsEditing(false);
        setEditingItem(null);
        fetchData();
      } else {
        toast.error(`Failed to ${isNew ? 'create' : 'update'} item`);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-8813977d/upload-image`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              imageData: reader.result as string,
              fileName: file.name,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          setEditingItem({ ...editingItem, imageUrl: data.imageUrl });
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-50 overflow-y-auto">
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-400">
                Manage your blog posts and initiatives
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'blog'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('initiatives')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'initiatives'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Initiatives
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : isEditing ? (
            <EditForm
              item={editingItem}
              type={activeTab}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setEditingItem(null);
              }}
              onChange={setEditingItem}
              onImageUpload={handleImageUpload}
            />
          ) : (
            <>
              {/* Create Button */}
              <div className="mb-6">
                <button
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New {activeTab === 'blog' ? 'Post' : 'Initiative'}
                </button>
              </div>

              {/* Items List */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'blog'
                  ? blogPosts.map((post) => (
                      <ItemCard
                        key={post.id}
                        item={post}
                        type="blog"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  : initiatives.map((initiative) => (
                      <ItemCard
                        key={initiative.id}
                        item={initiative}
                        type="initiative"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  type,
  onEdit,
  onDelete,
}: {
  item: any;
  type: 'blog' | 'initiative';
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {type === 'blog' ? item.excerpt : item.description}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditForm({
  item,
  type,
  onSave,
  onCancel,
  onChange,
  onImageUpload,
}: {
  item: any;
  type: 'blog' | 'initiatives';
  onSave: () => void;
  onCancel: () => void;
  onChange: (item: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        {item.id ? 'Edit' : 'Create New'} {type === 'blog' ? 'Post' : 'Initiative'}
      </h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            placeholder="Enter title"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Image
          </label>
          <div className="flex gap-4 items-start">
            <label className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border-2 border-dashed border-gray-600 hover:border-emerald-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 text-gray-400">
                <ImageIcon className="w-5 h-5" />
                <span>Upload Image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {type === 'blog' ? (
          <>
            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Excerpt
              </label>
              <textarea
                value={item.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                placeholder="Brief summary"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={item.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                placeholder="Full article content"
              />
            </div>

            {/* Author & Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={item.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="Category"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={item.tags?.join(', ') || ''}
                onChange={(e) =>
                  handleChange(
                    'tags',
                    e.target.value.split(',').map((t) => t.trim())
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </>
        ) : (
          <>
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                placeholder="Describe the initiative"
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Impact
              </label>
              <input
                type="text"
                value={item.impact}
                onChange={(e) => handleChange('impact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="e.g., 5,000+ students supported"
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save {type === 'blog' ? 'Post' : 'Initiative'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}