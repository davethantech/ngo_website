import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    author: string;
}

export function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .order('published_at', { ascending: false });

                if (error) throw error;
                if (data) setPosts(data as BlogPost[]);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    return (
        <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-emerald-600 font-semibold tracking-wider text-sm uppercase">Latest Updates</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6 text-center">News & Stories</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
                        Stay informed about our latest activities, success stories, and the impact we're making together.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl h-96 animate-pulse" />
                        ))
                    ) : posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-6 flex flex-col flex-grow text-left">
                                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-emerald-500" />
                                        {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'No Date'}
                                    </span>
                                    <span className="flex items-center">
                                        <User className="w-4 h-4 mr-1 text-emerald-500" />
                                        {post.author}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                                    <Link to={`/blog/${post.id}`}>
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <Link
                                    to={`/blog/${post.id}`}
                                    className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 text-sm group"
                                >
                                    Read Full Story <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
