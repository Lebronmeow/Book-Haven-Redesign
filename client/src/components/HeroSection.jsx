import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import TextRotate from './TextRotate';

gsap.registerPlugin(ScrollTrigger);

/* Floating particle dots */
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
            animation: `heroFloat${p.id % 3} ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes heroFloat0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(30px, -40px) scale(1.2); opacity: 0.6; }
          66% { transform: translate(-20px, -60px) scale(0.8); opacity: 0.2; }
        }
        @keyframes heroFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(-40px, 30px) scale(1.3); opacity: 0.5; }
        }
        @keyframes heroFloat2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          25% { transform: translate(20px, -20px); opacity: 0.1; }
          75% { transform: translate(-30px, 20px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  const rotatingWords = ['adventure', 'journey', 'universe', 'discovery', 'escape'];

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/hero-library.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      />

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-900/80 via-surface-900/50 to-surface-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-900/30 via-transparent to-surface-900/30" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <motion.img
          src="/logo.png"
          alt="Book Haven"
          className="max-h-28 md:max-h-40 w-auto mb-10 drop-shadow-2xl opacity-90"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 0.8, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Static text line */}
        <motion.p
          className="font-sans text-lg sm:text-xl md:text-2xl text-cream-200/60 tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Where every book is a new
        </motion.p>

        {/* BIG rotating word — the focal element */}
        <motion.div
          className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TextRotate
            words={rotatingWords}
            interval={2800}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold"
          />
        </motion.div>

        {/* Subheading */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-cream-200/50 font-sans mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Discover your next great read with us
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={handleScrollDown}
          className="btn-gold text-lg font-semibold"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(212,175,55,0.35)' }}
          whileTap={{ scale: 0.97 }}
        >
          Start Reading
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-cream-200/40 text-xs font-sans tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gold-500/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
