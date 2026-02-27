import { motion } from 'motion/react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
    {
        question: 'What is the Layeni Ogunmakinwa Foundation (LOF)?',
        answer: 'The Layeni Ogunmakinwa Foundation is a non-governmental organization dedicated to empowering underprivileged communities through education, healthcare, and economic support.',
    },
    {
        question: 'How can I donate to the foundation?',
        answer: 'You can donate directly through our website by clicking the "Donate Now" button. We accept various payment methods including credit cards and bank transfers.',
    },
    {
        question: 'Can I volunteer for LOF projects?',
        answer: 'Yes! We are always looking for passionate individuals to join our team. Please visit our "Become a Volunteer" page to fill out the application form.',
    },
    {
        question: 'Where do my donations go?',
        answer: '100% of public donations go directly to our field programs. Administrative costs are covered by our founding partners.',
    },
    {
        question: 'How do you measure the impact of your projects?',
        answer: 'We use a data-driven approach to monitor and evaluate all our projects. Our "Impact" section provides real-time metrics on lives touched and projects completed.',
    },
    {
        question: 'Is my donation tax-deductible?',
        answer: 'LOF is a registered NGO. Depending on your country of residence, your donation may be tax-deductible. We provide receipts for all contributions.',
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="text-lg font-semibold text-gray-900">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="mt-4 text-gray-600 leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </div>
    );
}

export function FAQPage() {
    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Header */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600"
                    >
                        Find answers to common questions about our foundation, programs, and how you can get involved.
                    </motion.p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <FAQItem {...faq} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-emerald-50 rounded-3xl p-12">
                        <MessageCircle className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Can't find the answer you're looking for? Please contact our team and we'll be happy to help.
                        </p>
                        <Link
                            to="/#contact"
                            className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors inline-block"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
