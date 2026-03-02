import { motion } from 'motion/react';
import { useInView } from './hooks/use-in-view';
import { Users, MapPin, GraduationCap, Stethoscope, Briefcase, CheckCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImpactCounter } from './ImpactCounter';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ImpactStory {
  id: string;
  quote: string;
  author: string;
  role: string;
  image_url: string;
}

export function Impact() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackStories: ImpactStory[] = [
    {
      id: 'f1',
      quote: 'The LOF scholarship program changed my life. I am now pursuing my dream of becoming a doctor, and I will give back to my community.',
      author: 'Amina K.',
      role: 'Scholarship Recipient',
      image_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'f2',
      quote: 'Thanks to the clean water project, our community no longer suffers from waterborne diseases. Our children are healthier and happier.',
      author: 'Chief Okonkwo',
      role: 'Community Leader',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'f3',
      quote: 'The business training and microfinance support helped me start my own business. I now employ five people from my village.',
      author: 'Grace O.',
      role: 'Entrepreneur',
      image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&q=80'
    },
  ];

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('impact_stories')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setStories(data);
        } else {
          setStories(fallbackStories);
        }
      } catch (err) {
        // Suppress network errors during pre-CMS phase
        setStories(fallbackStories);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  return (
    <section id="impact" ref={ref} className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm mb-4">
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Measuring What Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every number tells a story of transformation, hope, and sustainable change
            in communities across the region.
          </p>
        </motion.div>

        {/* Real-time Stats Grid */}
        <div className="mb-20">
          <ImpactCounter />
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Stories of Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-emerald-200 transition-all flex flex-col h-full"
              >
                <div className="mb-6">
                  <svg
                    className="w-10 h-10 text-emerald-500/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic flex-grow">
                  "{story.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-100 flex-shrink-0">
                    <img
                      src={story.image_url}
                      alt={story.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 leading-tight">
                      {story.author}
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">
                      {story.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden group">
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-700" />

            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Be Part of the Change</h3>
              <p className="text-lg md:text-xl mb-10 text-emerald-50/90 max-w-2xl mx-auto leading-relaxed">
                Your support can transform lives and create lasting impact in communities
                that need it most. Join our mission today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/volunteer"
                  className="w-full sm:w-auto px-10 py-4 bg-white text-emerald-700 rounded-full font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
                >
                  Donate Today
                </Link>
                <Link
                  to="/volunteer"
                  className="w-full sm:w-auto px-10 py-4 bg-emerald-800/40 backdrop-blur-md text-white rounded-full font-bold hover:bg-emerald-800/60 transition-all border border-white/20 active:scale-95"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
