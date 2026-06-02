import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function TextRotate({ words = [], interval = 2500, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  const word = words[currentIndex] || '';
  const letters = word.split('');

  return (
    <span className={`inline-flex perspective-1000 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-flex"
          initial="enter"
          animate="center"
          exit="exit"
        >
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block text-gold-gradient"
              style={{ transformOrigin: 'bottom center', padding: '0 0.02em' }}
              variants={{
                enter: {
                  rotateX: 90,
                  opacity: 0,
                  y: 30,
                  filter: 'blur(8px)',
                },
                center: {
                  rotateX: 0,
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.6,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: {
                  rotateX: -90,
                  opacity: 0,
                  y: -30,
                  filter: 'blur(8px)',
                  transition: {
                    duration: 0.4,
                    delay: i * 0.02,
                    ease: [0.55, 0, 1, 0.45],
                  },
                },
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
