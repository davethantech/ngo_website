import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

    const fallbackPosts: BlogPost[] = [
        {
            id: 'fb1',
            title: 'Building Resilient Communities Through Education',
            excerpt: 'Discover how our new scholarship program is transforming lives and creating future leaders in underserved regions.',
            content: `Education is the most powerful weapon which you can use to change the world. At Layeni Ogunmakinwa Foundation, we believe that every child deserves a chance to learn and grow.\n\nOur recent scholarship program has reached over 500 students across the region, providing them with not just tuition fees, but also mentorship, books, and a safe learning environment. We've seen firsthand how a single scholarship can change the trajectory of a child's life and, subsequently, their entire community.\n\nWe invite you to join us in this mission. Your support can help us reach even more children and build a brighter future for all.`,
            image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200',
            author: 'Admin',
            published_at: new Date().toISOString()
        },
        {
            id: 'fb2',
            title: 'Clean Water: A Foundation for Health',
            excerpt: 'Our latest borehole project has brought clean, safe drinking water to over 3,000 community members, reducing water-borne diseases.',
            content: `Access to clean water is a fundamental human right, yet many communities still struggle with water scarcity and contamination. Our Foundation's Clean Water Initiative aims to bridge this gap.\n\nThis month, we celebrated the completion of three borehole projects in the southern districts. These wells now provide safe, reliable drinking water to more than 3,000 residents. The impact is immediate: children are healthier, and families are no longer spending hours trekking to distant, unsafe water sources.\n\nThis is just the beginning. With your continued partnership, we plan to install ten more boreholes by the end of the year.`,
            image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200',
            author: 'Admin',
            published_at: new Date().toISOString()
        },
        {
            id: 'fb3',
            title: 'Empowering Women Entrepreneurs',
            excerpt: 'Through micro-loans and vocational training, we are helping women build sustainable businesses and support their families.',
            content: `When you empower a woman, you empower a nation. Our Women Empowerment Program is designed to provide underprivileged women with the tools and resources they need to achieve financial independence.\n\nThrough our latest vocational training cycle, forty women have graduated with skills in tailoring, catering, and digital literacy. Each graduate received a small startup grant and ongoing mentorship to help them launch their micro-enterprises.\n\nWe are already seeing incredible results, with several businesses already turning a profit and hiring other local women. Together, we are building a more inclusive and prosperous society.`,
            image_url: 'https://images.unsplash.com/photo-1761370571873-5d869310d731?q=80&w=1200&auto=format&fit=crop',
            author: 'Admin',
            published_at: new Date().toISOString()
        }
    ];

    const handleShare = async () => {
        if (!post) return;
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    useEffect(() => {
        async function fetchPost() {
            try {
                // Try fetching from Supabase first
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    // Search in fallback data if fetch fails
                    const localFallback = fallbackPosts.find(item => item.id === id);
                    if (localFallback) {
                        setPost(localFallback);
                    } else {
                        throw error;
                    }
                    return;
                }

                if (data) setPost(data as BlogPost);
            } catch (err) {
                // Final check in local fallbacks before giving up
                const localFallback = fallbackPosts.find(item => item.id === id);
                if (localFallback) {
                    setPost(localFallback);
                } else {
                    console.error('Error fetching post:', err);
                }
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
                        <button
                            onClick={handleShare}
                            className="p-3 bg-gray-50 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all duration-300 active:scale-95 shadow-sm group"
                            title="Share story"
                        >
                            <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
