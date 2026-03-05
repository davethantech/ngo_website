import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Initiative {
    id: string;
    title: string;
    description: string;
    image_url: string;
    status: 'Ongoing' | 'Past' | 'Upcoming';
    category: string;
    impact: string;
}

export function InitiativesPage() {
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        document.title = 'Our Initiatives | Layeni Ogunmakinwa Foundation';
        const fallbackInitiatives: Initiative[] = [
            {
                id: 'fi1',
                title: 'Education for All',
                description: 'Providing scholarships and school supplies to over 5,000 children in underserved communities.',
                image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
                status: 'Ongoing',
                category: 'Education',
                impact: '5k+ Students'
            },
            {
                id: 'fi2',
                title: 'Community Health Outreach',
                description: 'Bringing medical care and health education to remote villages and urban settlements.',
                image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
                status: 'Ongoing',
                category: 'Health',
                impact: '10k+ Treated'
            },
            {
                id: 'fi3',
                title: 'Clean Water Initiative',
                description: 'Installing sustainable water systems and providing hygiene education in drought-prone areas.',
                image_url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
                status: 'Past',
                category: 'Social Welfare',
                impact: '20+ Boreholes'
            },
            {
                id: 'fi4',
                title: 'Women Empowerment',
                description: 'Vocational training and micro-loans for women to start and grow their own businesses.',
                image_url: 'https://images.unsplash.com/photo-1761370571873-5d869310d731?q=80&w=1000&auto=format&fit=crop',
                status: 'Upcoming',
                category: 'Economic Growth',
                impact: '500+ Entrepreneurs'
            }
        ];

        async function fetchInitiatives() {
            try {
                const { data, error } = await supabase
                    .from('initiatives')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data && data.length > 0) {
                    // Map impact_summary from DB to the component's 'impact' interface
                    const mappedData = data.map(item => ({
                        ...item,
                        impact: item.impact_summary || 'Making Impact'
                    }));
                    setInitiatives(mappedData as Initiative[]);
                } else {
                    setInitiatives(fallbackInitiatives);
                }
            } catch (err) {
                console.error('Initiatives fetching error:', err);
                setInitiatives(fallbackInitiatives);
            } finally {
                setLoading(false);
            }
        }
        fetchInitiatives();
    }, []);

    return (
        <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm mb-4">
                        Our Work
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Driving Positive Change
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore our diverse initiatives designed to empower communities and build a sustainable future.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['All', 'Ongoing', 'Past', 'Upcoming'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${activeFilter === status
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
                        ))
                    ) : initiatives.filter(i => activeFilter === 'All' || i.status === activeFilter).length > 0 ? (
                        initiatives
                            .filter(i => activeFilter === 'All' || i.status === activeFilter)
                            .map((initiative, index) => {
                                const Icon = (LucideIcons as any)[initiative.category === 'Education' ? 'GraduationCap' :
                                    initiative.category === 'Health' ? 'Stethoscope' :
                                        initiative.category === 'Governance' ? 'UserCheck' :
                                            initiative.category === 'Economic Growth' ? 'Briefcase' :
                                                initiative.category === 'Social Welfare' ? 'Heart' : 'Target'] || LucideIcons.HelpCircle;
                                return (
                                    <motion.div
                                        key={initiative.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={initiative.image_url}
                                                alt={initiative.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                                            <div className="absolute bottom-4 left-6 text-white text-left">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Icon className="w-5 h-5 text-emerald-400" />
                                                    <span className="text-sm font-medium text-emerald-100">{initiative.status}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold">{initiative.title}</h3>
                                            </div>
                                        </div>

                                        <div className="p-8 text-left">
                                            <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                                {initiative.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full">
                                                    {initiative.category || 'Making Impact'}
                                                </span>
                                                <Link
                                                    to={`/initiatives/${initiative.id}`}
                                                    className="inline-flex items-center text-gray-900 font-semibold hover:text-emerald-600 transition-colors"
                                                >
                                                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                    ) : (
                        <div className="col-span-full py-32 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center">
                            <div className="text-center max-w-md mx-auto px-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LucideIcons.SearchX className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeFilter} initiatives yet</h3>
                                <p className="text-gray-500">
                                    We don't have any initiatives currently categorized as "{activeFilter}". Please check another status or come back later.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
