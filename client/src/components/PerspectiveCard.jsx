import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function PerspectiveCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotate = 8;
    setRotateY(((x - centerX) / centerX) * maxRotate);
    setRotateX((-(y - centerY) / centerY) * maxRotate);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  }

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        className={`glass-strong rounded-2xl p-6 md:p-8 relative overflow-hidden preserve-3d cursor-default ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glare effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}
