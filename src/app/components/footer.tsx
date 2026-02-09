import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': ['Home', 'About Us', 'Initiatives', 'Impact', 'Blog', 'Contact'],
    'Get Involved': ['Donate', 'Volunteer', 'Partner With Us', 'Careers'],
    'Resources': ['Annual Reports', 'Success Stories', 'FAQs', 'Privacy Policy'],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                LOF
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">
                  Layeni Ogunmakinwa
                </span>
                <span className="text-xs text-gray-400">Foundation</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Empowering communities and transforming lives through sustainable 
              development programs.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-emerald-600 transition-colors flex items-center justify-center"
                  aria-label={social}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-lg mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="font-semibold text-lg mb-2">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and stories.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
              />
              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Layeni Ogunmakinwa Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for communities worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
