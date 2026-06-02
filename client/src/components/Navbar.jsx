import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingCart, LogOut, User } from 'lucide-react';
import { UserContext } from '../context/userContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNav = () => setNav(!nav);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = nav ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [nav]);

  async function handleLogout() {
    try {
      await axios.get('/api/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  };

  const mobileLinksContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: 0.15 },
    },
  };

  const mobileLinkItem = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <>
      {/* Liquid Glass Floating Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`relative flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 h-14 md:h-16 rounded-2xl transition-all duration-500 ${
            scrolled ? 'shadow-xl shadow-black/30' : 'shadow-lg shadow-black/10'
          }`}
          style={{
            background: scrolled
              ? 'rgba(10, 10, 11, 0.6)'
              : 'rgba(10, 10, 11, 0.3)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(212, 175, 55, 0.08)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Inner light refraction line */}
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 30%, rgba(255,255,255,0.1) 50%, rgba(212,175,55,0.15) 70%, transparent 100%)',
            }}
          />

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 focus:outline-none"
          >
            <img
              className="max-h-12 md:max-h-14 w-auto drop-shadow-md scale-125 md:scale-150 transform origin-left"
              src="/logo.png"
              alt="Book Haven"
            />
          </button>

          {/* Center Nav Links — Desktop */}
          <div className="hidden md:flex items-center gap-x-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="relative px-4 py-2 text-cream-100/80 hover:text-cream-50 font-sans text-sm tracking-wide uppercase transition-all duration-300 rounded-xl hover:bg-white/[0.04] group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0 transition-all duration-300 group-hover:w-3/4" />
              </button>
            ))}
          </div>

          {/* Right Side — Desktop Auth */}
          <div className="hidden md:flex items-center gap-x-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="flex items-center gap-x-2 text-cream-100/70 hover:text-gold-400 transition-colors duration-300 font-sans text-sm px-3 py-1.5 rounded-xl hover:bg-white/[0.04]"
                >
                  <User className="w-4 h-4" />
                  <span>Hi {user.username}!</span>
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: '#D4AF37',
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 text-cream-200/50 hover:text-red-400 transition-colors duration-300 font-sans text-sm px-2 py-1.5 rounded-xl hover:bg-red-500/[0.06]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-cream-100/80 hover:text-cream-50 transition-all duration-300 hover:bg-white/[0.04]"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #C9A84C 100%)',
                    color: '#0A0A0B',
                    boxShadow: '0 2px 12px rgba(212,175,55,0.25)',
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={handleNav}
            className="md:hidden text-cream-100 hover:text-gold-400 transition-colors duration-300 p-2 rounded-xl hover:bg-white/[0.04]"
            aria-label="Toggle menu"
          >
            {nav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {nav && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(10,10,11,0.92)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
              }}
            />

            <motion.div
              className="relative z-10 flex flex-col items-center justify-center h-full gap-y-6"
              variants={mobileLinksContainer}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.button
                  key={link.path}
                  variants={mobileLinkItem}
                  onClick={() => { navigate(link.path); handleNav(); }}
                  className="text-2xl font-serif text-cream-100 hover:text-gold-400 transition-colors duration-300"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                variants={mobileLinkItem}
                className="w-16 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-2"
              />

              {user ? (
                <>
                  <motion.button
                    variants={mobileLinkItem}
                    onClick={() => { navigate('/wishlist'); handleNav(); }}
                    className="flex items-center gap-x-2 text-xl font-sans text-cream-100 hover:text-gold-400 transition-colors duration-300"
                  >
                    <User className="w-5 h-5" />
                    Hi {user.username}!
                  </motion.button>
                  <motion.button
                    variants={mobileLinkItem}
                    onClick={() => { navigate('/cart'); handleNav(); }}
                    className="btn-outline-gold flex items-center gap-x-2 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                  </motion.button>
                  <motion.button
                    variants={mobileLinkItem}
                    onClick={() => { handleLogout(); handleNav(); }}
                    className="flex items-center gap-x-2 text-lg font-sans text-cream-200/60 hover:text-red-400 transition-colors duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    variants={mobileLinkItem}
                    onClick={() => { navigate('/login'); handleNav(); }}
                    className="btn-outline-gold text-lg"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    variants={mobileLinkItem}
                    onClick={() => { navigate('/register'); handleNav(); }}
                    className="btn-gold text-lg"
                  >
                    Sign Up
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
