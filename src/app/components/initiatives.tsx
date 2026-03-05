import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useInView } from './hooks/use-in-view';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Initiative {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'Ongoing' | 'Past' | 'Upcoming';
  impact: string;
}

export function Initiatives() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallbackInitiatives: Initiative[] = [
      {
        id: 'fi1',
        title: 'Education for All',
        description: 'Providing scholarships and school supplies to over 5,000 children in underserved communities.',
        image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
        status: 'Ongoing',
        impact: '5k+ Students'
      },
      {
        id: 'fi2',
        title: 'Community Health Outreach',
        description: 'Bringing medical care and health education to remote villages and urban settlements.',
        image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        status: 'Ongoing',
        impact: '10k+ Treated'
      }
    ];

    async function fetchInitiatives() {
      try {
        const { data, error } = await supabase
          .from('initiatives')
          .select('*')
          .eq('status', 'Ongoing')
          .limit(2);

        if (error) {
          setInitiatives(fallbackInitiatives);
          return;
        }
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            ...item,
            impact: item.impact_summary || item.impact || 'Making Impact'
          }));
          setInitiatives(mapped as Initiative[]);
        } else {
          setInitiatives(fallbackInitiatives);
        }
      } catch (err) {
        setInitiatives(fallbackInitiatives);
      } finally {
        setLoading(false);
      }
    }
    fetchInitiatives();
  }, []);

  const getIcon = (index: number) => {
    const icons = ['GraduationCap', 'Heart', 'Droplet', 'Users'];
    const iconName = icons[index % icons.length];
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return Icon;
  };

  return (
    <section id="initiatives" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm mb-4">
            Our Initiatives
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Programs That Make a Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive programs address the core needs of communities, creating
            sustainable impact across education, health, and economic development.
          </p>
        </motion.div>

        {/* Initiatives Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
            ))
          ) : initiatives.length > 0 ? (
            initiatives.map((initiative, index) => {
              const Icon = getIcon(index);
              return (
                <motion.div
                  key={initiative.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={initiative.image_url}
                      alt={initiative.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Icon className="w-7 h-7 text-emerald-600" />
                    </div>

                    {/* Impact Badge */}
                    {initiative.impact && (
                      <div className="absolute bottom-4 right-4 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                        {initiative.impact}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {initiative.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {initiative.description}
                    </p>
                    <Link
                      to={`/initiatives/${initiative.id}`}
                      className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors gap-2"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-center">
              <div className="text-center max-w-md mx-auto px-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LucideIcons.Heart className="w-10 h-10 text-emerald-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">New Initiatives Coming Soon</h3>
                <p className="text-gray-600">
                  We are currently finalizing some exciting new projects. Check back soon or follow our blog for updates.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            to="/initiatives"
            className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Initiatives
          </Link>
        </div>
      </div>
    </section>
  );
}
