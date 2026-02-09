import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { initiativesData, Initiative } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback'; // Assuming this exists or I should use standard img if not easily reusable. Check imports.
import { ArrowRight, Heart, Users, Droplet, GraduationCap } from 'lucide-react';

export function InitiativesPage() {
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);

    useEffect(() => {
        // Simulate loading to feel dynamic
        setTimeout(() => {
            setInitiatives(initiativesData);
        }, 500);
    }, []);

    const getIcon = (index: number) => {
        const icons = [GraduationCap, Heart, Droplet, Users];
        return icons[index % icons.length];
    };

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

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {initiatives.map((initiative, index) => {
                        const Icon = getIcon(index);
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
                                        src={initiative.imageUrl}
                                        alt={initiative.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                    <div className="absolute bottom-4 left-6 text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className="w-5 h-5 text-emerald-400" />
                                            <span className="text-sm font-medium text-emerald-100">{initiative.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold">{initiative.title}</h3>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {initiative.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full">
                                            {initiative.impact}
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
                    })}
                </div>
            </div>
        </div>
    );
}
