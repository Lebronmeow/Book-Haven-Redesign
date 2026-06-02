import React, { useState, useEffect, useRef } from 'react';

export default function CircularGallery({ items = [], onItemClick }) {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animFrameRef = useRef(null);
  
  // Physics & interaction state
  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const mouseX = useRef(0);
  const isHovering = useRef(false);

  const totalItems = items.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const angleStep = totalItems > 0 ? 360 / totalItems : 0;
  const radius = isMobile ? 220 : 380;

  useEffect(() => {
    if (totalItems <= 1) return;

    const animate = () => {
      // If hovering, adjust target rotation continuously based on mouse position
      if (isHovering.current) {
        // mouseX goes from -1 (left) to 1 (right)
        // Multiply by a speed factor
        const speed = 1.5; 
        targetRotationRef.current += mouseX.current * speed;
      } else {
        // Slowly auto-rotate if not hovering
        targetRotationRef.current += 0.2;
      }
      
      // Smooth lerp for buttery animation
      currentRotationRef.current += (targetRotationRef.current - currentRotationRef.current) * 0.05;
      setRotation(currentRotationRef.current);
      
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [totalItems]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the container
    const width = rect.width;
    // Normalize to -1 (left edge) to 1 (right edge)
    mouseX.current = ((x / width) - 0.5) * 2;
  };

  if (totalItems === 0) return null;

  return (
    <div
      className="relative w-full py-12 cursor-ew-resize select-none"
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; mouseX.current = 0; }}
      onMouseMove={handleMouseMove}
    >
      {/* 3D Carousel Stage */}
      <div
        className="relative mx-auto overflow-visible"
        style={{
          height: isMobile ? 320 : 450,
          perspective: '1400px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Rotating ring */}
        <div
          className="absolute left-1/2 w-0 h-0"
          style={{
            top: isMobile ? '40%' : '45%',
            transformStyle: 'preserve-3d',
            transform: `translateX(-50%) rotateY(${-rotation}deg)`,
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * angleStep;
            // Calculate how "front-facing" this item is
            const relAngle = (((-rotation + itemAngle) % 360) + 360) % 360;
            const isFront = relAngle < 35 || relAngle > 325;
            const isBack = relAngle > 120 && relAngle < 240;

            return (
              <div
                key={item.isbn_13 || i}
                className="absolute"
                style={{
                  width: isMobile ? 120 : 180,
                  left: isMobile ? -60 : -90,
                  top: isMobile ? -90 : -130,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  opacity: isBack ? 0.2 : isFront ? 1 : 0.7,
                  filter: isBack ? 'blur(3px)' : 'none',
                  transition: 'opacity 0.4s ease, filter 0.4s ease',
                  zIndex: isFront ? 10 : 1,
                }}
                onClick={(e) => {
                  // Only trigger click if we aren't dragging/scrolling fast
                  onItemClick?.(item.isbn_13);
                }}
              >
                {/* Book Cover */}
                <div
                  className={`rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
                    isFront
                      ? 'ring-2 ring-gold-500/50 shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                      : 'shadow-black/60'
                  }`}
                  style={{
                    transform: isFront ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <img
                    src={import.meta.env.VITE_APP_DOMAIN + item.image_sm}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover pointer-events-none"
                    loading="lazy"
                  />
                  {isFront && (
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent" />
                  )}
                </div>

                {/* Title/Author for front item */}
                <div 
                  className={`mt-4 text-center px-1 transition-all duration-500 ${
                    isFront ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-cream-50 font-serif text-sm md:text-base font-semibold line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-cream-200/60 text-xs md:text-sm truncate mt-1">
                    {item.author}
                  </p>
                  {item.price && (
                    <p className="text-gold-500 text-sm font-semibold mt-1.5">
                      ${item.price % 1 !== 0 ? item.price : item.price + '.00'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reflection gradient at the bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--surface-900) 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}
