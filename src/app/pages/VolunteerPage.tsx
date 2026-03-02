import { motion } from 'motion/react';
import { Heart, Globe, Users, ShieldCheck } from 'lucide-react';
import volunteerBg from '../../assets/volunteer-bg.webp';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function VolunteerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative py-15 flex items-center bg-emerald-900 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <ImageWithFallback
                        src={volunteerBg}
                        alt="Volunteer with LOF"
                        className="w-full h-full object-cover"
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
                                Join Our Global Network
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                        >
                            Become a{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Volunteer
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-gray-300 mb-8 leading-relaxed"
                        >
                            Make a difference with your time and talent. Join LOF's mission to transform lives
                            and build stronger communities worldwide.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Why Volunteer Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Passion Driven</h3>
                            <p className="text-gray-600">Work on causes that matter most to you and your community.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Global Impact</h3>
                            <p className="text-gray-600">Connect with a worldwide network of change-makers.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
                            <p className="text-gray-600">Build lasting relationships while serving those in need.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Skill Building</h3>
                            <p className="text-gray-600">Develop leadership and professional skills in the field.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                    >
                        <div className="bg-emerald-600 px-8 py-6 text-white text-center">
                            <h2 className="text-2xl font-bold">Volunteer Application Form</h2>
                            <p className="text-emerald-100">Please fill out the form below and we will get back to you soon.</p>
                        </div>

                        {/* Branded Form Over Container */}
                        <div className="p-4 sm:p-8 min-h-[800px] flex flex-col">
                            <div className="flex-grow">
                                <iframe
                                    src="https://docs.google.com/forms/d/e/1FAIpQLSfB6b-w5wAl1F3GueZOJeGKdaPMoGkD-Sygpifszoynk9stlg/viewform?embedded=true"
                                    width="100%"
                                    height="1200"
                                    frameBorder="0"
                                    marginHeight={0}
                                    marginWidth={0}
                                    className="w-full min-h-[1200px]"
                                >
                                    Loading…
                                </iframe>

                                {/* Fallback link if iframe fails */}
                                <div className="mt-8 text-center text-sm text-gray-500">
                                    Having trouble viewing the form?{' '}
                                    <a
                                        href="https://forms.gle/grCpF9MYnAo4NZfT7"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 font-semibold hover:underline"
                                    >
                                        Open in a new tab
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
