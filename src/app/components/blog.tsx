import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useInView } from './hooks/use-in-view';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

export function Blog() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);

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
    <section id="blog" ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm mb-4">
            Latest Updates
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            News & Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest initiatives, success stories, and insights
            from the field.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-[450px] animate-pulse" />
            ))
          ) : posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>
                      {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'No Date'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <Link
                    to={`/blog/${post.id}`}
                    className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/blog"
            className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Posts
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
