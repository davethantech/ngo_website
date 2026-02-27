import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';

interface ImpactMetric {
    id: string;
    label: string;
    value: string;
    icon_name: string;
}

export function ImpactCounter() {
    const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const { data, error } = await supabase
                    .from('impact_metrics')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) setMetrics(data);
            } catch (error) {
                console.error('Error fetching impact metrics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();

        // Real-time subscription
        const subscription = supabase
            .channel('impact_metrics_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'impact_metrics' }, () => {
                fetchMetrics();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((metric, index) => {
                const Icon = (LucideIcons as any)[metric.icon_name] || LucideIcons.HelpCircle;

                return (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
                    >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                            {metric.value}
                        </div>
                        <div className="text-gray-600 font-medium">{metric.label}</div>
                    </motion.div>
                );
            })}
        </div>
    );
}
