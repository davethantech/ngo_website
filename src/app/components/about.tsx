import { motion } from 'motion/react';
import { useInView } from './hooks/use-in-view';
import { Target, Eye, Award, Globe, Heart, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import aboutBg from '../../assets/about.webp';

export function About() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To improve quality of life through health awareness, social welfare, and initiatives that foster accountability and productivity in the public sector.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description:
        'A world where everyone has access to quality education to alleviate poverty towards the goal of living a successful and meaningful life.',
    },
    {
      icon: Award,
      title: 'Our Identity',
      description:
        'Established by the children of Late Chief Dr. N.O.I. Ogunmakinwa, we work to assist in promoting healthy living awareness and social welfare services.',
    },
    {
      icon: Globe,
      title: 'Equal Value',
      description:
        'Bearing in mind the fact that no life has more value than the other, we strive to ensure that all people have access to resources for a better life.',
    },
  ];

  return (
    <section id="about" ref={ref} className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium text-sm mb-4">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Uplifting Lives. Restoring Hope.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Building Futures through compassion, stewardship, and community action.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <ImageWithFallback
                src={aboutBg}
                alt="LOF Mission In Action"
                className="w-full h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-600 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-400 rounded-full -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-left"
          >
            <h3 className="text-3xl font-bold text-blue-900 mb-8">
              Preamble
            </h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At the Layeni Ogunmakinwa Memorial Foundation, we maintain that all individuals share a responsibility to manage the world's resources, which are provided for the collective benefit of everyone, irrespective of creed, color, social status, or political affiliation.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Every life holds equal value, though circumstances of birth and fortune often shape individual opportunities. Founded in honor of Chief Dr. N.O.I. Ogunmakinwa by his children, we are dedicated to uplifting the vulnerable, empowering the underserved, and restoring hope where it is most needed.
            </p>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed font-semibold text-emerald-700 italic">
              "Together, we can ensure no one is left behind."
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[
                  { icon: Heart, color: 'emerald' },
                  { icon: Users, color: 'blue' },
                  { icon: Globe, color: 'teal' },
                  { icon: Award, color: 'amber' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-full bg-${item.color}-100 border-2 border-white flex items-center justify-center text-${item.color}-600 shadow-sm`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-base font-bold text-blue-900">
                  Join Our Community
                </p>
                <p className="text-sm text-gray-600">
                  Making a difference across USA and Nigeria
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
