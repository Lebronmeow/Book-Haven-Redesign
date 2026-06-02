import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const SpotifyContext = createContext();

export const useSpotify = () => useContext(SpotifyContext);

const CLIENT_ID = '1e72e80012c145cbbb75f425db9c7854';
const REDIRECT_URI = window.location.origin + '/';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state'
];

export const SpotifyProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('spotify_token'));
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Parse token from URL hash if returning from Spotify Auth
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const urlParams = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = urlParams.get('access_token');
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem('spotify_token', accessToken);
        // Clear hash
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const login = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('spotify_token');
    if (player) {
      player.disconnect();
    }
  };

  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Book Haven Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        setIsReady(false);
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) {
          setIsActive(false);
          return;
        }

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setIsActive(true);
      });

      spotifyPlayer.connect();
    };

    return () => {
      document.body.removeChild(script);
      if (player) player.disconnect();
    };
    // eslint-disable-next-line
  }, [token]);

  const playTrack = useCallback(async (uri) => {
    if (!deviceId || !token) return;
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (err) {
      console.error("Failed to play track:", err);
    }
  }, [deviceId, token]);

  const searchTracks = useCallback(async (query) => {
    if (!token || !query) return [];
    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      return data.tracks?.items || [];
    } catch (err) {
      console.error("Search failed:", err);
      return [];
    }
  }, [token]);

  return (
    <SpotifyContext.Provider value={{
      token,
      login,
      logout,
      isReady,
      isActive,
      isPaused,
      currentTrack,
      playTrack,
      searchTracks,
      player
    }}>
      {children}
    </SpotifyContext.Provider>
  );
};
