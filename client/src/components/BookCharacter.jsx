import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookCharacter({ state = 'idle', lookAt = { x: 0, y: 0 } }) {
  const [blinking, setBlinking] = useState(false);

  // Auto-blink
  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 180);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const eyeOffset = useMemo(() => {
    const maxOffset = 5;
    const x = Math.max(-maxOffset, Math.min(maxOffset, lookAt.x * 0.04));
    const y = Math.max(-maxOffset, Math.min(maxOffset, lookAt.y * 0.04));
    return { x, y };
  }, [lookAt.x, lookAt.y]);

  const isWatching = state === 'watching';
  const isHiding = state === 'hiding';
  const isCelebrating = state === 'celebrating';
  const isPeeking = state === 'peeking';
  const isIdle = state === 'idle';
  const showEyes = !blinking && !isCelebrating;

  // Body animation
  const bodyAnimation = isCelebrating
    ? { y: [0, -18, 0, -12, 0], rotate: [0, -5, 5, -3, 0], scaleY: [1, 1.05, 0.95, 1] }
    : isPeeking
    ? { y: [40, 10, 12, 10], rotate: 0 }
    : isHiding
    ? { y: [0, 8], scaleY: [1, 0.9], rotate: 0 }
    : isWatching
    ? { y: [0, -4, 0], rotate: [0, eyeOffset.x * 0.3, 0] }
    : { y: [0, -8, 0], rotate: [0, -2, 2, -1, 0] };

  const bodyTransition = isCelebrating
    ? { duration: 0.7, ease: 'easeInOut' }
    : isPeeking
    ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    : isHiding
    ? { duration: 0.4, ease: 'easeInOut' }
    : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' };

  return (
    <motion.svg
      viewBox="0 0 200 160"
      width="200"
      height="160"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
      animate={bodyAnimation}
      transition={bodyTransition}
    >
      {/* Shadow */}
      <motion.ellipse
        cx="100" cy="148" rx="60" ry="6" fill="rgba(0,0,0,0.3)"
        animate={{ rx: isCelebrating ? 50 : isHiding ? 65 : 60 }}
      />

      {/* Left book cover */}
      <motion.path
        d="M 100 45 L 100 130 L 30 125 L 30 40 Z"
        fill="#C9A84C"
        stroke="#A68B2E"
        strokeWidth="1.5"
      />
      <path d="M 98 48 L 98 128 L 35 123 L 35 43 Z" fill="#D4AF37" />

      {/* Right book cover */}
      <motion.path
        d="M 100 45 L 100 130 L 170 125 L 170 40 Z"
        fill="#C9A84C"
        stroke="#A68B2E"
        strokeWidth="1.5"
      />
      <path d="M 102 48 L 102 128 L 165 123 L 165 43 Z" fill="#D4AF37" />

      {/* Book spine */}
      <rect x="96" y="40" width="8" height="90" fill="#A68B2E" rx="2" />

      {/* Left pages */}
      <path d="M 98 48 L 98 126 L 38 121 L 38 43 Z" fill="#FEFCF3" stroke="#E8D9B0" strokeWidth="0.5" />
      <line x1="48" y1="60" x2="90" y2="62" stroke="#E8D9B0" strokeWidth="0.8" opacity="0.5" />
      <line x1="48" y1="70" x2="90" y2="72" stroke="#E8D9B0" strokeWidth="0.8" opacity="0.5" />
      <line x1="48" y1="100" x2="90" y2="102" stroke="#E8D9B0" strokeWidth="0.8" opacity="0.5" />

      {/* Right pages */}
      <path d="M 102 48 L 102 126 L 162 121 L 162 43 Z" fill="#FEFCF3" stroke="#E8D9B0" strokeWidth="0.5" />
      <line x1="110" y1="62" x2="152" y2="60" stroke="#E8D9B0" strokeWidth="0.8" opacity="0.5" />
      <line x1="110" y1="72" x2="152" y2="70" stroke="#E8D9B0" strokeWidth="0.8" opacity="0.5" />
      <line x1="110" y1="102" x2="152" y2="100" stroke="#E8D9B0" strokeWidth="0.8" opacity="0.5" />

      {/* ─── Eyes ─── */}
      <g>
        {isCelebrating ? (
          <>
            <motion.path d="M 72 78 Q 78 70 84 78" stroke="#1A1A1D" strokeWidth="2.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
            <motion.path d="M 116 78 Q 122 70 128 78" stroke="#1A1A1D" strokeWidth="2.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
          </>
        ) : blinking ? (
          <>
            <line x1="70" y1="78" x2="86" y2="78" stroke="#1A1A1D" strokeWidth="2" strokeLinecap="round" />
            <line x1="114" y1="78" x2="130" y2="78" stroke="#1A1A1D" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : isPeeking ? (
          <>
            {/* Nervous darting eyes */}
            <circle cx="78" cy="78" r="10" fill="white" stroke="#1A1A1D" strokeWidth="1.5" />
            <motion.circle r="4.5" fill="#1A1A1D" animate={{ cx: [74, 82, 76, 80, 78], cy: 78 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            <circle cx="122" cy="78" r="10" fill="white" stroke="#1A1A1D" strokeWidth="1.5" />
            <motion.circle r="4.5" fill="#1A1A1D" animate={{ cx: [118, 126, 120, 124, 122], cy: 78 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }} />
          </>
        ) : (
          <>
            {/* Left eye */}
            <circle cx="78" cy="78" r="10" fill="white" stroke="#1A1A1D" strokeWidth="1.5" />
            <motion.circle r="4.5" fill="#1A1A1D" animate={{ cx: isWatching ? 78 + eyeOffset.x : 78, cy: isWatching ? 78 + eyeOffset.y : 78 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
            <motion.circle r="1.8" fill="white" animate={{ cx: isWatching ? 76 + eyeOffset.x * 0.5 : 76, cy: isWatching ? 76 + eyeOffset.y * 0.5 : 76 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} />

            {/* Right eye */}
            <circle cx="122" cy="78" r="10" fill="white" stroke="#1A1A1D" strokeWidth="1.5" />
            <motion.circle r="4.5" fill="#1A1A1D" animate={{ cx: isWatching ? 122 + eyeOffset.x : 122, cy: isWatching ? 78 + eyeOffset.y : 78 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
            <motion.circle r="1.8" fill="white" animate={{ cx: isWatching ? 120 + eyeOffset.x * 0.5 : 120, cy: isWatching ? 76 + eyeOffset.y * 0.5 : 76 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
          </>
        )}

        {/* Mouth */}
        <motion.path
          d={isCelebrating ? 'M 88 92 Q 100 106 112 92' : isPeeking ? 'M 95 90 Q 100 93 105 90' : 'M 92 90 Q 100 97 108 90'}
          stroke="#1A1A1D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{ d: isCelebrating ? 'M 88 92 Q 100 106 112 92' : isPeeking ? 'M 95 90 Q 100 93 105 90' : 'M 92 90 Q 100 97 108 90' }}
          transition={{ duration: 0.3 }}
        />

        {/* Rosy cheeks */}
        <AnimatePresence>
          {isCelebrating && (
            <>
              <motion.circle cx="65" cy="88" r="6" fill="#E8A0BF" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.3 }} />
              <motion.circle cx="135" cy="88" r="6" fill="#E8A0BF" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.3 }} />
            </>
          )}
        </AnimatePresence>
      </g>

      {/* ─── Animated Hands (page-hands) ─── */}

      {/* Idle: gentle waving hands */}
      {isIdle && (
        <>
          <motion.path
            d="M 30 100 Q 20 80 25 65 Q 28 58 35 60"
            stroke="#E8D9B0" strokeWidth="3" fill="none" strokeLinecap="round"
            animate={{ d: ['M 30 100 Q 20 80 25 65 Q 28 58 35 60', 'M 30 100 Q 15 75 22 60 Q 26 52 34 55', 'M 30 100 Q 20 80 25 65 Q 28 58 35 60'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 170 100 Q 180 80 175 65 Q 172 58 165 60"
            stroke="#E8D9B0" strokeWidth="3" fill="none" strokeLinecap="round"
            animate={{ d: ['M 170 100 Q 180 80 175 65 Q 172 58 165 60', 'M 170 100 Q 185 75 178 60 Q 174 52 166 55', 'M 170 100 Q 180 80 175 65 Q 172 58 165 60'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </>
      )}

      {/* Watching: one hand waves hello */}
      {isWatching && (
        <>
          <motion.path
            d="M 170 100 Q 180 70 172 50 Q 168 42 160 45"
            stroke="#E8D9B0" strokeWidth="3" fill="none" strokeLinecap="round"
            animate={{ d: ['M 170 100 Q 180 70 172 50 Q 168 42 160 45', 'M 170 100 Q 185 65 175 45 Q 170 38 162 42', 'M 170 100 Q 180 70 172 50 Q 168 42 160 45'] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Small fingers on waving hand */}
          <motion.circle cx="160" cy="45" r="3" fill="#FEFCF3" stroke="#E8D9B0" strokeWidth="1"
            animate={{ cy: [45, 42, 45] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Hiding: page-hands covering eyes with trembling */}
      <AnimatePresence>
        {isHiding && (
          <>
            <motion.path
              d="M 38 90 Q 38 50 78 55 Q 90 57 95 65 L 95 95 Q 80 97 60 95 Z"
              fill="#FDF8E8" stroke="#E8D9B0" strokeWidth="1"
              initial={{ scaleY: 0, originY: '100%' }}
              animate={{ scaleY: 1, x: [0, -1, 1, -0.5, 0.5, 0] }}
              exit={{ scaleY: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
            <motion.path
              d="M 162 90 Q 162 50 122 55 Q 110 57 105 65 L 105 95 Q 120 97 140 95 Z"
              fill="#FDF8E8" stroke="#E8D9B0" strokeWidth="1"
              initial={{ scaleY: 0, originY: '100%' }}
              animate={{ scaleY: 1, x: [0, 1, -1, 0.5, -0.5, 0] }}
              exit={{ scaleY: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.05 }}
            />
            {/* Peeking eye between hands */}
            <motion.circle
              cx="100" cy="72" r="4"
              fill="white" stroke="#1A1A1D" strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 1, 0.8] }}
              transition={{ duration: 2, delay: 0.8 }}
            />
            <motion.circle
              cx="100" cy="72" r="2"
              fill="#1A1A1D"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 1, 0.8] }}
              transition={{ duration: 2, delay: 0.9 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Celebrating: hands thrown up + crown + enhanced sparkles */}
      <AnimatePresence>
        {isCelebrating && (
          <>
            {/* Left hand up */}
            <motion.path
              d="M 30 100 Q 15 60 30 30 Q 35 22 42 28"
              stroke="#E8D9B0" strokeWidth="3" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
            {/* Right hand up */}
            <motion.path
              d="M 170 100 Q 185 60 170 30 Q 165 22 158 28"
              stroke="#E8D9B0" strokeWidth="3" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />

            {/* Gold crown */}
            <motion.path
              d="M 80 38 L 85 28 L 93 35 L 100 22 L 107 35 L 115 28 L 120 38 Z"
              fill="#D4AF37" stroke="#A68B2E" strokeWidth="1"
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />

            {/* Enhanced sparkles */}
            {[
              { cx: 45, cy: 30 }, { cx: 155, cy: 25 },
              { cx: 30, cy: 50 }, { cx: 170, cy: 45 },
              { cx: 60, cy: 18 }, { cx: 140, cy: 15 },
            ].map((pos, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={pos.cx} cy={pos.cy} r="2.5" fill="#D4AF37"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0], y: [0, -12, -24] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeOut' }}
                />
                <motion.path
                  d={`M ${pos.cx} ${pos.cy - 5} L ${pos.cx + 2.5} ${pos.cy} L ${pos.cx} ${pos.cy + 5} L ${pos.cx - 2.5} ${pos.cy} Z`}
                  fill="#E8D48B"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 180] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, delay: i * 0.12, ease: 'easeOut' }}
                />
              </motion.g>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Peeking: gripping hand on edge */}
      {isPeeking && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Hand gripping the bottom edge */}
          <motion.path
            d="M 55 135 Q 55 128 60 126 Q 65 124 68 128 L 68 138"
            fill="#FDF8E8" stroke="#E8D9B0" strokeWidth="1.5"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Small fingers */}
          <motion.circle cx="60" cy="125" r="2.5" fill="#FEFCF3" stroke="#E8D9B0" strokeWidth="1"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>
      )}
    </motion.svg>
  );
}
