import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { useSpotify } from '../context/SpotifyContext';

export default function SpotifyPlayer() {
  const { 
    token, login, isReady, isActive, isPaused, currentTrack, 
    playTrack, searchTracks, player 
  } = useSpotify();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
      <div className="fixed bottom-4 right-4 z-50">
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

  const albumArt = currentTrack?.album?.images[0]?.url || 'https://via.placeholder.com/150/111113/D4AF37?text=Spotify';
  const trackName = currentTrack?.name || 'Ready to Play';
  const artistName = currentTrack?.artists?.[0]?.name || 'Double-click to search';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* Search Popover */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 w-72 bg-surface-800 border border-surface-600 rounded-2xl shadow-2xl overflow-hidden p-3 origin-bottom-right"
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

      {/* Music Artwork Player Container - isolate creates stacking context so vinyl doesn't go behind page */}
      <motion.div 
        className="relative group cursor-pointer"
        style={{ isolation: 'isolate' }}
        onDoubleClick={handleDoubleClick}
        whileHover={{ scale: 1.02 }}
      >
        {/* Vinyl Record */}
        <motion.div
          className="absolute inset-y-0 right-0 w-24 h-24 rounded-full bg-black shadow-lg flex items-center justify-center border-[2px] border-[#111]"
          style={{ zIndex: -1, right: 0, top: '50%', marginTop: '-3rem' }}
          animate={{
            x: isPaused ? 0 : 50,
            rotate: isPaused ? 0 : 360
          }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 25 },
            rotate: { 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop" 
            }
          }}
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-1 rounded-full border border-white/10" />
          <div className="absolute inset-3 rounded-full border border-white/5" />
          <div className="absolute inset-5 rounded-full border border-white/10" />
          
          {/* Center Label */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            {/* Center Image */}
            <img src={albumArt} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gold-600/30 mix-blend-multiply" />
            
            {/* Circular Text: Book Heaven */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
              <path id="curve" d="M 10 50 A 40 40 0 1 1 90 50 A 40 40 0 1 1 10 50" fill="transparent" />
              <text fontSize="18" fontWeight="bold" fill="#FEFCF3" letterSpacing="1">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  BOOK HEAVEN
                </textPath>
              </text>
            </svg>

            {/* Spindle hole */}
            <div className="absolute w-2 h-2 bg-black rounded-full border border-white/20 z-10" />
          </div>
        </motion.div>

        {/* Main Artwork Cover */}
        <div className="relative z-10 flex items-center bg-surface-800 rounded-xl shadow-2xl overflow-hidden border border-surface-600/50 pr-4 h-24">
          <img 
            src={albumArt} 
            alt="Album Cover" 
            className="w-24 h-24 object-cover"
          />
          <div className="pl-4 py-2 flex flex-col justify-center min-w-[140px] max-w-[180px]">
            <p className="text-sm font-bold text-cream-100 truncate">{trackName}</p>
            <p className="text-xs text-gold-400 truncate">{artistName}</p>
            
            {/* Controls */}
            {isActive && (
              <div className="flex items-center gap-3 mt-2 text-cream-100">
                <button onClick={(e) => { e.stopPropagation(); player?.previousTrack(); }} className="hover:text-gold-500 transition-colors">
                  <SkipBack size={16} fill="currentColor" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); player?.togglePlay(); }} className="hover:text-gold-500 transition-colors">
                  {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); player?.nextTrack(); }} className="hover:text-gold-500 transition-colors">
                  <SkipForward size={16} fill="currentColor" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
