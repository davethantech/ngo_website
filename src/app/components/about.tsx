import { motion } from 'motion/react';
import { useInView } from './hooks/use-in-view';
import { Target, Eye, Award, Globe } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To create sustainable change through education, healthcare, and community development programs that empower individuals and transform communities.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description:
        'A world where every individual has access to opportunities for growth, health, and prosperity, regardless of their background or circumstances.',
    },
    {
      icon: Award,
      title: 'Our Values',
      description:
        'Integrity, compassion, excellence, and accountability guide every decision we make and every action we take in service of our communities.',
    },
    {
      icon: Globe,
      title: 'Our Impact',
      description:
        'We measure success not in numbers, but in transformed lives, empowered communities, and the sustainable change we create together.',
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Building a Better Tomorrow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The Layeni Ogunmakinwa Foundation was founded on the belief that every 
            person deserves the opportunity to thrive.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560220604-1985ebfe28b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwdm9sdW50ZWVycyUyMGhlbHBpbmclMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcwNjI1MzQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Volunteers helping community"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-500 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-400 rounded-full -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Dedicated to Creating Lasting Change
            </h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Since our inception, we have been committed to addressing the root causes 
              of inequality and poverty through sustainable, community-led initiatives. 
              Our approach combines local knowledge with global best practices to deliver 
              programs that truly make a difference.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We believe in the power of partnership and work closely with communities, 
              local organizations, and stakeholders to ensure our programs are culturally 
              appropriate, sustainable, and driven by the needs of those we serve.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Join Our Community
                </p>
                <p className="text-sm text-gray-600">
                  1,000+ volunteers making a difference
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
