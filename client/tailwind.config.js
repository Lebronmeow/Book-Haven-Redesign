/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.jsx',
    './src/components/**/*.jsx',
    './src/App.jsx',
    './src/main.jsx',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#E8D48B',
          400: '#D4C06A',
          500: '#D4AF37',
          600: '#C9A84C',
          700: '#A68B2E',
          800: '#856F24',
        },
        surface: {
          950: '#050506',
          900: '#0A0A0B',
          850: '#0E0E10',
          800: '#111113',
          700: '#1A1A1D',
          600: '#242428',
          500: '#2E2E33',
          400: '#3A3A40',
        },
        cream: {
          50: '#FEFCF3',
          100: '#FDF8E8',
          200: '#F5ECD0',
          300: '#E8D9B0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8D48B 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0B 0%, #111113 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.2)',
        'inner-gold': 'inset 0 0 20px rgba(212, 175, 55, 0.1)',
        'book': '6px 6px 18px rgba(0,0,0,0.4), -2px -2px 8px rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
  mode: 'jit',
}
