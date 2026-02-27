import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image_url: string;
    author: string;
    published_at: string;
}

export function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) setPost(data as BlogPost);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4 text-center">Post not found</h2>
                <Link to="/blog" className="text-emerald-600 hover:underline">
                    Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <article className="pt-24 pb-16 bg-white min-h-screen text-left">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
                        <div className="flex items-center space-x-6 text-gray-500">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-900">{post.author}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'No Date'}
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden mb-12 shadow-lg">
                    <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-emerald max-w-none text-gray-700 text-left">
                    {post.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </div>
        </article>
    );
}
