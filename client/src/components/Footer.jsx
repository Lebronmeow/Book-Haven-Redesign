import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Cart', path: '/cart' },
  ];

  return (
    <footer className="relative bg-surface-950">
      {/* Gold gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* ─── Column 1: Logo + Tagline ─── */}
          <div className="flex flex-col items-center md:items-start">
            <button
              onClick={() => navigate('/')}
              className="focus:outline-none mb-4"
            >
              <img
                className="max-h-16 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
                src="/logo.png"
                alt="Book Haven"
              />
            </button>
            <p className="text-cream-200/50 font-sans text-sm leading-relaxed text-center md:text-left max-w-xs">
              Where every book is a new adventure. Curating the finest literary
              experiences for discerning readers since day one.
            </p>
            <div className="flex items-center gap-x-2 mt-4">
              <BookOpen className="w-4 h-4 text-gold-500/50" />
              <span className="text-cream-200/30 text-xs font-sans tracking-wider uppercase">
                Premium Bookstore
              </span>
            </div>
          </div>

          {/* ─── Column 2: Quick Links ─── */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-cream-50 text-lg mb-5">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="gold-underline text-cream-200/60 hover:text-gold-400 font-sans text-sm transition-colors duration-300 text-center md:text-left w-fit mx-auto md:mx-0"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ─── Column 3: Contact ─── */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-serif text-cream-50 text-lg mb-5">Contact</h4>
            <div className="flex flex-col gap-y-3">
              <a
                href="mailto:hello@bookhaven.com"
                className="flex items-center gap-x-3 text-cream-200/60 hover:text-gold-400 font-sans text-sm transition-colors duration-300"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@bookhaven.com
              </a>
              <a
                href="#"
                className="flex items-center gap-x-3 text-cream-200/60 hover:text-gold-400 font-sans text-sm transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                GitHub
              </a>
              <a
                href="#"
                className="flex items-center gap-x-3 text-cream-200/60 hover:text-gold-400 font-sans text-sm transition-colors duration-300"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-cream-200/30 font-sans text-xs tracking-wide">
            © 2024 Book Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
