import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="pt-24 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-emerald-900 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Join Our Mission
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-emerald-100 max-w-3xl mx-auto"
                    >
                        Help us create sustainable change and empower communities across the region.
                        Discover how you can contribute your skills to a greater cause.
                    </motion.p>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Open Positions</h2>
                    <div className="grid gap-6">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {job.department}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </div>
                                        </div>
                                        <p className="mt-4 text-gray-600 max-w-2xl">{job.description}</p>
                                    </div>
                                    <Link
                                        to="/volunteer"
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors self-start md:self-center"
                                    >
                                        Apply Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Work with LOF?</h2>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Meaningful Impact</h4>
                                    <p className="text-gray-600">Your work directly contributes to improving lives and supporting underprivileged communities.</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Growth & Learning</h4>
                                    <p className="text-gray-600">We invest in our team's professional development through training and mentorship programs.</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Diverse & Inclusive</h4>
                                    <p className="text-gray-600">Join a global team that celebrates diversity and values unique perspectives.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-100 rounded-3xl aspect-video flex items-center justify-center">
                            <span className="text-emerald-700 font-medium">Culture Image Placeholder</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
