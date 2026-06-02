import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare } from 'lucide-react';

/* Simulated animated shader background using CSS gradients and noise */
function ShaderBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050506]">
      {/* Dynamic swirling gradients */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,175,55,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(100,50,120,0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 80%, rgba(20,60,100,0.1) 0%, transparent 40%)
          `,
          filter: 'blur(40px)',
          animation: 'pulseGlow 8s ease-in-out infinite alternate'
        }}
      />
      
      {/* SVG Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Floating gold particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `rgba(212,175,55,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px rgba(212,175,55,${p.opacity * 0.5})`,
            animation: `contactFloat${p.id % 3} ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes contactFloat0 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, -50px); }
        }
        @keyframes contactFloat1 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-30px, 40px); }
        }
        @keyframes contactFloat2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 30px); }
        }
        
        /* Animated border gradient */
        .glass-card-animated-border {
          position: relative;
          background: rgba(15, 15, 17, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 1rem;
          z-index: 1;
        }
        .glass-card-animated-border::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 1rem;
          padding: 1px;
          background: linear-gradient(
            45deg,
            rgba(212,175,55,0.1),
            rgba(255,255,255,0.05),
            rgba(212,175,55,0.3),
            rgba(255,255,255,0.05),
            rgba(212,175,55,0.1)
          );
          background-size: 200% 200%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: borderGlow 4s linear infinite;
          z-index: -1;
        }
        @keyframes borderGlow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </div>
  );
}

export default function Contact() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Optional: Track mouse movement to shift the background gradient slightly
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/about/contact', {
        name: username,
        email: email,
        message: message,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Message sent');
        setUsername('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again later.');
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <ShaderBackground />

      <motion.div
        className="glass-card-animated-border p-8 md:p-10 w-full max-w-lg relative shadow-2xl shadow-black/50"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Book Haven"
            className="max-w-[180px] md:max-w-[220px] h-auto drop-shadow-xl"
          />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl text-center text-cream-50 font-bold mb-2">Get in Touch</h1>
        <p className="text-cream-300/70 text-center mb-8 text-sm font-sans tracking-wide">
          We'd love to hear from you
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field */}
          <div className="group">
            <label className="flex items-center gap-2 text-cream-200/80 text-sm font-medium mb-2 transition-colors group-focus-within:text-gold-400">
              <User size={16} className="text-gold-500/70 group-focus-within:text-gold-400 transition-colors" />
              Name
            </label>
            <input
              className="w-full bg-surface-900/50 border border-gold-500/20 rounded-xl px-4 py-3 text-cream-50 placeholder-cream-100/30 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all shadow-inner"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email field */}
          <div className="group">
            <label className="flex items-center gap-2 text-cream-200/80 text-sm font-medium mb-2 transition-colors group-focus-within:text-gold-400">
              <Mail size={16} className="text-gold-500/70 group-focus-within:text-gold-400 transition-colors" />
              Email
            </label>
            <input
              className="w-full bg-surface-900/50 border border-gold-500/20 rounded-xl px-4 py-3 text-cream-50 placeholder-cream-100/30 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all shadow-inner"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Message field */}
          <div className="group">
            <label className="flex items-center gap-2 text-cream-200/80 text-sm font-medium mb-2 transition-colors group-focus-within:text-gold-400">
              <MessageSquare size={16} className="text-gold-500/70 group-focus-within:text-gold-400 transition-colors" />
              Message
            </label>
            <textarea
              className="w-full bg-surface-900/50 border border-gold-500/20 rounded-xl px-4 py-3 text-cream-50 placeholder-cream-100/30 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all shadow-inner min-h-[120px] resize-y"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="w-full py-3 mt-4 rounded-xl font-semibold text-surface-900 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gold-500/20"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #C9A84C 100%)',
            }}
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </div>
  );
}
