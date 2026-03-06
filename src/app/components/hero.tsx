import { motion } from 'motion/react';
import { ArrowRight, Heart, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import heroBg from '../../assets/hero-bg.webp';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={heroBg}
          alt="Layeni Ogunmakinwa Foundation - Community Empowerment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-30 pb-15 md:pt-30 md:pb-15">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-4 py-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full mb-4"
            >
              <span className="text-emerald-400 font-medium text-sm">
                Making a Difference Since 2015
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400">Empowering Communities,{' '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Transforming Lives
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed"
            >
              The Layeni Ogunmakinwa Foundation is dedicated to creating sustainable
              change through education, healthcare, and community development programs
              that reach the heart of underserved communities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/volunteer"
                className="group px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 whitespace-nowrap"
              >
                Get Involved
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/#about"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20 whitespace-nowrap"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 gap-4"
          >
            {[
              {
                icon: Users,
                stat: '150,000+',
                label: 'People Reached',
                color: 'emerald',
              },
              {
                icon: Heart,
                stat: '500+',
                label: 'Communities Served',
                color: 'teal',
              },
              {
                icon: TrendingUp,
                stat: '1,200+',
                label: 'Success Stories',
                color: 'cyan',
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 lg:p-5 hover:bg-white/15 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-${item.color}-500/20`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {item.stat}
                    </div>
                    <div className="text-gray-300 text-sm">{item.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
