import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Pause, SkipForward, SkipBack, Music, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSpotify } from '../context/SpotifyContext';

export default function SpotifyPlayer() {
  const { 
    token, login, isReady, isActive, isPaused, currentTrack, 
    playTrack, searchTracks, player 
  } = useSpotify();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Auto-search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (searchQuery.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchTracks(searchQuery);
        setSearchResults(results);
      }, 500);
    } else {
      setSearchResults([]);
    }
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, searchTracks]);

  if (!token) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button 
          onClick={login}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-3 rounded-full shadow-xl transition-all duration-300 font-semibold"
        >
          <Music size={20} />
          <span>Connect Spotify</span>
        </button>
      </div>
    );
  }

  const handleDoubleClick = () => {
    setShowSearch(prev => !prev);
  };

  const handlePlayResult = (uri) => {
    playTrack(uri);
    setShowSearch(false);
  };

  const albumArt = currentTrack?.album?.images[0]?.url || 'https://via.placeholder.com/300/111113/D4AF37?text=Spotify';
  const trackName = currentTrack?.name || 'Ready to Play';
  const artistName = currentTrack?.artists?.[0]?.name || 'Double-click to search';

  return (
    <motion.div 
      className="fixed bottom-6 right-0 z-[9999] flex flex-col items-end pointer-events-none"
      initial={{ x: 0 }}
      animate={{ x: isMinimized ? 'calc(100% - 32px)' : '-24px' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      
      {/* Search Popover */}
      <AnimatePresence>
        {showSearch && !isMinimized && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 w-80 bg-surface-800 border border-surface-600 rounded-2xl shadow-2xl overflow-hidden p-3 origin-bottom-right pointer-events-auto"
          >
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                autoFocus
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-900 border border-surface-600 rounded-lg py-2 pl-9 pr-3 text-sm text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {searchResults.length === 0 && searchQuery && (
                <div className="text-center text-gray-400 text-xs py-4">No results found</div>
              )}
              {searchResults.map(track => (
                <button
                  key={track.id}
                  onClick={() => handlePlayResult(track.uri)}
                  className="flex items-center gap-3 p-2 hover:bg-surface-700 rounded-lg transition-colors text-left"
                >
                  <img src={track.album.images[2]?.url} alt="" className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-cream-100 truncate">{track.name}</p>
                    <p className="text-xs text-gray-400 truncate">{track.artists[0].name}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center pointer-events-auto">
        {/* Toggle Button */}
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="bg-surface-800 border border-surface-600 border-r-0 rounded-l-xl p-1 h-12 shadow-lg hover:bg-surface-700 transition-colors z-20 flex items-center justify-center text-gray-400 hover:text-gold-400 mr-[-1px]"
        >
          {isMinimized ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Music Artwork Player Container */}
        <motion.div 
          className="relative group cursor-pointer"
          style={{ isolation: 'isolate' }}
          onDoubleClick={handleDoubleClick}
          whileHover={!isMinimized ? { scale: 1.02 } : {}}
        >
          {/* Vinyl Record */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-lg flex items-center justify-center border-[2px] border-yellow-200/40"
            style={{ 
              zIndex: -1, 
              top: 0,
              background: 'radial-gradient(circle, #e6c258 0%, #d4af37 40%, #8a6312 80%, #4a3505 100%)'
            }}
            animate={{
              y: isPaused || isMinimized ? 0 : -60,
              rotate: isPaused || isMinimized ? 0 : 360
            }}
            transition={{
              y: { type: "spring", stiffness: 300, damping: 25 },
              rotate: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop" 
              }
            }}
          >
            {/* Vinyl grooves */}
            <div className="absolute inset-1 rounded-full border border-black/10" />
            <div className="absolute inset-3 rounded-full border border-black/15 shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]" />
            <div className="absolute inset-5 rounded-full border border-black/10" />
            <div className="absolute inset-7 rounded-full border border-black/20" />
            
            {/* Center Label */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-[2px] border-black/80 bg-black">
              {/* Center Image */}
              <img src={albumArt} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
              
              {/* Circular Text: Book Heaven */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
                <path id="curve" d="M 10 50 A 40 40 0 1 1 90 50 A 40 40 0 1 1 10 50" fill="transparent" />
                <text fontSize="18" fontWeight="bold" fill="#D4AF37" letterSpacing="1.5">
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    BOOK HEAVEN
                  </textPath>
                </text>
              </svg>

              {/* Spindle hole */}
              <div className="absolute w-2.5 h-2.5 bg-black rounded-full border border-yellow-500/50 z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
          </motion.div>

          {/* Main Artwork Cover */}
          <div className="relative z-10 flex items-center bg-surface-800 rounded-xl shadow-2xl overflow-hidden border border-surface-600/50 pr-4 h-28 sm:h-32">
            <img 
              src={albumArt} 
              alt="Album Cover" 
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover"
            />
            <div className="pl-5 py-2 flex flex-col justify-center min-w-[160px] max-w-[200px]">
              <p className="text-base sm:text-lg font-bold text-cream-100 truncate">{trackName}</p>
              <p className="text-sm text-gold-400 truncate">{artistName}</p>
              
              {/* Controls */}
              {isActive && (
                <div className="flex items-center gap-4 mt-3 text-cream-100">
                  <button onClick={(e) => { e.stopPropagation(); player?.previousTrack(); }} className="hover:text-gold-500 transition-colors">
                    <SkipBack size={20} fill="currentColor" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); player?.togglePlay(); }} className="hover:text-gold-500 transition-colors scale-110">
                    {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); player?.nextTrack(); }} className="hover:text-gold-500 transition-colors">
                    <SkipForward size={20} fill="currentColor" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
