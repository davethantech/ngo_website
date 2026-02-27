import { motion } from 'motion/react';
import { useInView } from './hooks/use-in-view';
import { Users, MapPin, GraduationCap, Stethoscope, Briefcase, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImpactCounter } from './ImpactCounter';

export function Impact() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const testimonials = [
    {
      quote:
        'The LOF scholarship program changed my life. I am now pursuing my dream of becoming a doctor, and I will give back to my community.',
      author: 'Amina K.',
      role: 'Scholarship Recipient',
    },
    {
      quote:
        'Thanks to the clean water project, our community no longer suffers from waterborne diseases. Our children are healthier and happier.',
      author: 'Chief Okonkwo',
      role: 'Community Leader',
    },
    {
      quote:
        'The business training and microfinance support helped me start my own business. I now employ five people from my village.',
      author: 'Grace O.',
      role: 'Entrepreneur',
    },
  ];

  return (
    <section id="impact" ref={ref} className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm mb-4">
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Measuring What Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every number tells a story of transformation, hope, and sustainable change
            in communities across the region.
          </p>
        </motion.div>

        {/* Real-time Stats Grid */}
        <div className="mb-20">
          <ImpactCounter />
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Stories of Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-emerald-200 transition-all"
              >
                <div className="mb-6">
                  <svg
                    className="w-10 h-10 text-emerald-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Be Part of the Change</h3>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
              Your support can transform lives and create lasting impact in communities
              that need it most.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/volunteer"
                className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Donate Today
              </Link>
              <Link
                to="/volunteer"
                className="px-8 py-4 bg-emerald-700 text-white rounded-full font-semibold hover:bg-emerald-800 transition-colors border-2 border-white/20"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
