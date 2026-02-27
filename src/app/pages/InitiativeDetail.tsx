import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Initiative {
    id: string;
    title: string;
    description: string;
    content?: string;
    image_url: string;
    status: string;
    category?: string;
    impact?: string;
}

export function InitiativeDetail() {
    const { id } = useParams<{ id: string }>();
    const [initiative, setInitiative] = useState<Initiative | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInitiative() {
            try {
                const { data, error } = await supabase
                    .from('initiatives')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) setInitiative(data as Initiative);
            } catch (error) {
                console.error('Error fetching initiative:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInitiative();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!initiative) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Initiative Not Found</h2>
                <Link to="/initiatives" className="text-emerald-600 hover:underline">
                    Back to Initiatives
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={initiative.image_url}
                    alt={initiative.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1 bg-emerald-600/80 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                                {initiative.category || 'Initiative'}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                {initiative.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-50 font-medium">
                                Status: {initiative.status}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 bg-white rounded-t-3xl p-8 md:p-12 shadow-xl">
                <Link
                    to="/initiatives"
                    className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Initiatives
                </Link>

                <div className="prose prose-lg prose-emerald max-w-none text-left">
                    <p className="lead text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                        {initiative.description}
                    </p>

                    <div className="my-12 p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h3 className="text-2xl font-bold text-emerald-900 mb-4 text-left">The Vision</h3>
                        <p className="text-gray-700 text-left">
                            {initiative.content || initiative.description}
                        </p>
                    </div>

                    <h3 className="text-left">Key Objectives</h3>
                    <ul className="grid md:grid-cols-2 gap-4 not-prose mt-6">
                        {['Sustainable Impact', 'Community Led', 'Future Proof', 'Scalable Solutions'].map((item, i) => (
                            <li key={i} className="flex items-center text-gray-700">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
