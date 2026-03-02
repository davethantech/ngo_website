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

    const fallbackPosts: BlogPost[] = [
        {
            id: 'fb1',
            title: 'Building Resilient Communities Through Education',
            excerpt: 'Discover how our new scholarship program is transforming lives and creating future leaders in underserved regions.',
            image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000',
            published_at: new Date().toISOString(),
            author: 'Admin'
        },
        {
            id: 'fb2',
            title: 'Clean Water: A Foundation for Health',
            excerpt: 'Our latest borehole project has brought clean, safe drinking water to over 3,000 community members, reducing water-borne diseases.',
            image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000',
            published_at: new Date().toISOString(),
            author: 'Admin'
        },
        {
            id: 'fb3',
            title: 'Empowering Women Entrepreneurs',
            excerpt: 'Through micro-loans and vocational training, we are helping women build sustainable businesses and support their families.',
            image_url: 'https://images.unsplash.com/photo-1761370571873-5d869310d731?q=80&w=1000&auto=format&fit=crop',
            published_at: new Date().toISOString(),
            author: 'Admin'
        }
    ];

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .order('published_at', { ascending: false });

                if (error) {
                    setPosts(fallbackPosts);
                    return;
                }

                if (data && data.length > 0) {
                    setPosts(data as BlogPost[]);
                } else {
                    setPosts(fallbackPosts);
                }
            } catch (err) {
                setPosts(fallbackPosts);
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
