import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash scrolling on path change or initial load if needed
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  const navLinks = [
    { label: 'Home', href: '/', type: 'route' },
    { label: 'About', href: '/#about', type: 'hash' },
    { label: 'Initiatives', href: '/#initiatives', type: 'hash' },
    { label: 'Impact', href: '/#impact', type: 'hash' },
    { label: 'Blog', href: '/#blog', type: 'hash' },
    { label: 'Contact', href: '/#contact', type: 'hash' },
  ];

  const handleNavClick = (link: { href: string; type: string }) => {
    setIsMobileMenuOpen(false);

    if (link.type === 'route') {
      navigate(link.href);
      window.scrollTo(0, 0);
    } else {
      // Hash link
      if (location.pathname !== '/') {
        navigate(link.href); // Navigate to /#hash
      } else {
        // We are on home, just scroll
        const hash = link.href.split('#')[1];
        const element = document.querySelector(`#${hash}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  LOF
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold text-lg leading-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    Layeni Ogunmakinwa
                  </span>
                  <span className={`text-xs ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
                    Foundation
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleNavClick(link)}
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isScrolled ? 'text-gray-700' : 'text-white'
                    }`}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Donate Now
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'
                }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="text-2xl font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button className="px-8 py-3 bg-emerald-600 text-white rounded-full font-medium text-lg hover:bg-emerald-700 transition-colors shadow-lg">
                Donate Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
