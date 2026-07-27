import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

export function BeneficiaryRegistrationPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 to-emerald-900/95" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 rounded-full text-emerald-200 text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Apply for Support
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Beneficiary Registration
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100 max-w-2xl mx-auto"
          >
            We are dedicated to supporting underprivileged communities. Fill out the form below to register for our assistance programs.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden p-2 sm:p-4"
          >
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '150%' }}>
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSdOF1-zQXdINc466v5AGavefX3XY7t3qpd4yhcU-VOYY413kw/viewform?embedded=true" 
                className="absolute top-0 left-0 w-full h-full border-0"
                title="Beneficiary Registration Form"
                allowFullScreen
              >
                Loading…
              </iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
