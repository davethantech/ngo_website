import { motion } from 'motion/react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import heroBg from '../../assets/hero-bg.webp';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FeaturedMetric {
  id: string;
  label: string;
  value: string;
  icon_name: string;
}

export function Hero() {
  const [metrics, setMetrics] = useState<FeaturedMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackMetrics: FeaturedMetric[] = [
    { id: 'm1', label: 'People Reached', value: '150,000+', icon_name: 'Users' },
    { id: 'm2', label: 'Communities Served', value: '500+', icon_name: 'Heart' },
    { id: 'm3', label: 'Success Stories', value: '1,200+', icon_name: 'TrendingUp' },
  ];

  useEffect(() => {
    async function fetchFeaturedMetrics() {
      try {
        const { data, error } = await supabase
          .from('impact_metrics')
          .select('*')
          .eq('is_featured', true)
          .order('display_order', { ascending: true })
          .limit(3);

        if (error) throw error;
        if (data && data.length > 0) {
          setMetrics(data);
        } else {
          // If no featured, just take top 3 by order
          const { data: fallbackData } = await supabase
            .from('impact_metrics')
            .select('*')
            .order('display_order', { ascending: true })
            .limit(3);
          setMetrics(fallbackData && fallbackData.length > 0 ? fallbackData : fallbackMetrics);
        }
      } catch (err) {
        console.error('Hero metrics fetch error:', err);
        setMetrics(fallbackMetrics);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedMetrics();

    // Real-time subscription for instant hero updates
    const channel = supabase
      .channel('hero_metrics_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'impact_metrics' }, () => {
        fetchFeaturedMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroBg}
          alt="Layeni Ogunmakinwa Foundation - Community Empowerment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-30 pb-15 md:pt-30 md:pb-15">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-4 py-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full mb-4"
            >
              <span className="text-emerald-400 font-medium text-sm">
                Making a Difference Since 2015
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400">Empowering Communities,{' '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Transforming Lives
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed"
            >
              The Layeni Ogunmakinwa Foundation is dedicated to creating sustainable
              change through education, healthcare, and community development programs
              that reach the heart of underserved communities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/volunteer"
                className="group px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 whitespace-nowrap"
              >
                Get Involved
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/#about"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20 whitespace-nowrap"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 gap-4"
          >
            {loading ? (
              // Skeleton UI
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 animate-pulse h-[100px]" />
              ))
            ) : metrics.map((item, index) => {
              const Icon = (LucideIcons as any)[item.icon_name] || HelpCircle;
              const colors = ['emerald', 'teal', 'cyan'];
              const color = colors[index % colors.length];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 lg:p-5 hover:bg-white/15 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors`}>
                      <Icon className={`w-8 h-8 text-emerald-400`} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">
                        {item.value}
                      </div>
                      <div className="text-gray-300 text-sm">{item.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
