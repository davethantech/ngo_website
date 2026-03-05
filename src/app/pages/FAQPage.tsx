import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import faqBg from '../../assets/faq-bg.webp';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../lib/supabase';

interface FAQ {
    category: string;
    question: string;
    answer: string;
}

const fallbackFaqs: FAQ[] = [
    {
        category: 'About Us',
        question: 'What is the Layeni Ogunmakinwa Foundation (LOF)?',
        answer: 'The Layeni Ogunmakinwa Foundation is a non-governmental organization dedicated to empowering underprivileged communities through education, healthcare, and economic support. We operate across Nigeria and the United States with a mission to create sustainable, lasting change.',
    },
    {
        category: 'Donations',
        question: 'How can I donate to the foundation?',
        answer: 'You can donate directly through our website by clicking the "Donate Now" button. We accept various payment methods including credit cards and bank transfers. Every contribution, no matter the size, makes a meaningful difference.',
    },
    {
        category: 'Volunteering',
        question: 'Can I volunteer for LOF projects?',
        answer: 'Yes! We are always looking for passionate individuals to join our team. Please visit our "Become a Volunteer" page to fill out the application form. We have opportunities both locally and remotely.',
    },
    {
        category: 'Donations',
        question: 'Where do my donations go?',
        answer: '100% of public donations go directly to our field programs including education, healthcare, and community empowerment initiatives. Administrative costs are covered by our founding partners, ensuring maximum impact from every donation.',
    },
    {
        category: 'Impact',
        question: 'How do you measure the impact of your projects?',
        answer: 'We use a data-driven approach to monitor and evaluate all our projects. Our "Impact" section provides real-time metrics on lives touched and projects completed. We publish detailed annual reports for full transparency.',
    },
    {
        category: 'Donations',
        question: 'Is my donation tax-deductible?',
        answer: 'LOF is a registered NGO. Depending on your country of residence, your donation may be tax-deductible. We provide official receipts for all contributions. Please consult your local tax advisor for specific guidance.',
    },
    {
        category: 'Partnerships',
        question: 'How can my organization partner with LOF?',
        answer: 'We welcome partnerships with businesses, institutions, and other NGOs that share our values. Please reach out via our Contact page and our partnerships team will get back to you within 48 hours.',
    },
];

const categoryColors: Record<string, string> = {
    'About Us': 'bg-blue-100 text-blue-700',
    'Donations': 'bg-emerald-100 text-emerald-700',
    'Volunteering': 'bg-teal-100 text-teal-700',
    'Impact': 'bg-amber-100 text-amber-700',
    'Partnerships': 'bg-purple-100 text-purple-700',
};

function FAQItem({ question, answer, category, index, isOpen, onToggle }: { question: string; answer: string; category: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-emerald-300 shadow-lg shadow-emerald-50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}
        >
            <button
                onClick={onToggle}
                className="flex w-full items-start justify-between text-left p-6 gap-4 group"
            >
                <div className="flex-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${categoryColors[category] ?? 'bg-emerald-50 text-emerald-600'}`}>
                        {category}
                    </span>
                    <p className={`text-lg font-semibold leading-snug transition-colors ${isOpen ? 'text-emerald-700' : 'text-gray-900 group-hover:text-emerald-700'}`}>
                        {question}
                    </p>
                </div>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mt-1 ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 border-t border-emerald-50">
                            <p className="text-gray-600 leading-relaxed pt-4">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        document.title = 'Frequently Asked Questions | LOF';
        async function fetchFaqs() {
            try {
                const { data, error } = await supabase
                    .from('faq_items')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setFaqs(data);
                } else {
                    setFaqs(fallbackFaqs);
                }
            } catch (err) {
                console.error('FAQ fetching error:', err);
                setFaqs(fallbackFaqs);
            } finally {
                setLoading(false);
            }
        }
        fetchFaqs();
    }, []);

    const filtered = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = (index: number) => {
        setActiveIndex(prev => prev === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative flex items-center bg-emerald-900 overflow-hidden min-h-[320px] md:min-h-[460px] pt-32 pb-12 md:py-28">
                <div className="absolute inset-0 z-0">
                    <ImageWithFallback
                        src={faqBg}
                        alt="FAQ at LOF"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-emerald-900/40" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-block px-3 py-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full mb-4 md:mb-6"
                        >
                            <span className="text-emerald-400 font-bold text-[10px] md:text-sm uppercase tracking-wider">
                                FAQ Help Center
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 text-white"
                        >
                            Frequently{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Asked
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base md:text-xl text-gray-300 leading-relaxed max-w-2xl"
                        >
                            Find answers to common questions about our foundation, programs, and how you can get involved.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative mb-12"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 text-gray-800 placeholder-gray-400 transition-all"
                        />
                    </motion.div>

                    {/* Accordion Items */}
                    <div className="space-y-4">
                        {filtered.length > 0 ? filtered.map((faq, index) => (
                            <FAQItem
                                key={index}
                                {...faq}
                                index={index}
                                isOpen={activeIndex === index}
                                onToggle={() => handleToggle(index)}
                            />
                        )) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 text-gray-500"
                            >
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-medium">No results found for "<span className="text-emerald-600">{search}</span>"</p>
                                <p className="text-sm mt-2">Try a different keyword or contact us directly.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Still Have Questions CTA */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-emerald-900 rounded-3xl p-12 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <MessageCircle className="w-8 h-8 text-emerald-300" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
                            <p className="text-lg text-emerald-100 mb-10 max-w-xl mx-auto">
                                Can't find the answer you're looking for? Please contact our friendly team and we'll be happy to help.
                            </p>
                            <Link
                                to="/#contact"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold transition-all hover:shadow-xl hover:shadow-emerald-900/50 hover:-translate-y-0.5"
                            >
                                Contact Our Team
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
