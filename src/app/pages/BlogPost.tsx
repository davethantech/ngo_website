import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { blogPostsData } from '../data/mockData';

export function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const post = blogPostsData.find(p => p.id === id);

    if (!post) {
        return <div className="p-20 text-center">Post not found</div>;
    }

    return (
        <article className="pt-24 pb-16 bg-white min-h-screen">
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
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

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
                                {post.date}
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden mb-12 shadow-lg">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-emerald max-w-none text-gray-700">
                    {post.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </div>
        </article>
    );
}
