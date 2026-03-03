import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Trophy, Zap, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import careerBg from '../../assets/career-bg.webp';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const jobs = [
    {
        id: 1,
        title: 'Program Manager',
        location: 'Lagos, Nigeria',
        type: 'Full-time',
        department: 'Operations',
        description: 'Lead and manage our community-based initiatives and ensure impactful delivery of programs.',
    },
    {
        id: 2,
        title: 'Volunteer Coordinator',
        location: 'Remote / Lagos',
        type: 'Part-time',
        department: 'Community Engagement',
        description: 'Engage and coordinate our global network of volunteers for various foundation projects.',
    },
    {
        id: 3,
        title: 'Development Officer',
        location: 'Lagos, Nigeria',
        type: 'Full-time',
        department: 'Fundraising',
        description: 'Drive fundraising efforts and manage donor relationships to support our ongoing missions.',
    },
];

export function CareersPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-10 lg:py-15 flex items-center bg-emerald-900 overflow-hidden min-h-[500px] lg:min-h-[500px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <ImageWithFallback
                        src={careerBg}
                        alt="Careers at LOF"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-emerald-900/50" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-block px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full mb-6"
                        >
                            <span className="text-emerald-400 font-medium text-sm">
                                Join Our Global Mission
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                        >
                            Work With{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Impact
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-gray-300 mb-8 leading-relaxed"
                        >
                            Help us create sustainable change and empower communities across the region.
                            Discover how you can contribute your skills to a greater cause.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Why Join LOF Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Join Our Team?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We offer more than just a job; we offer a platform to make a lasting difference in the world.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Meaningful Impact</h3>
                            <p className="text-gray-600">Your work directly contributes to improving lives and supporting communities.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
                            <p className="text-gray-600">Join a team committed to the highest standards of professional delivery.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-600">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
                            <p className="text-gray-600">Bring fresh ideas to solve complex social and developmental challenges.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
                                <UsersIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
                            <p className="text-gray-600">Work in a diverse, inclusive environment that values unique perspectives.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                            {jobs.length} Opportunities
                        </span>
                    </div>

                    <div className="grid gap-6 text-left">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {job.department}
                                            </span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-semibold text-emerald-600 uppercase">Hiring</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-emerald-500" />
                                                {job.type}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-emerald-500" />
                                                {job.department}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed max-w-3xl">
                                            {job.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-row lg:flex-col gap-4 items-center justify-end">
                                        <Link
                                            to="/#contact"
                                            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2 group-hover:px-10"
                                        >
                                            Apply Now
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 p-8 bg-emerald-900 rounded-3xl text-center text-white relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Don't see a fit?</h3>
                            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                                We're always looking for passionate individuals. Send us your resume and we'll keep you in mind for future opportunities.
                            </p>
                            <Link
                                to="/#contact"
                                className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-emerald-400 pb-1 hover:text-emerald-400 transition-colors"
                            >
                                Get in touch with our team <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
