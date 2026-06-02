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

// PKCE Helper Functions
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const SpotifyProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('spotify_token'));
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('Spotify Auth Error:', error);
        return;
      }

      if (code) {
        // Exchange code for token
        const codeVerifier = localStorage.getItem('spotify_code_verifier');
        if (!codeVerifier) return;

        try {
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: CLIENT_ID,
              grant_type: 'authorization_code',
              code,
              redirect_uri: REDIRECT_URI,
              code_verifier: codeVerifier,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setToken(data.access_token);
            localStorage.setItem('spotify_token', data.access_token);
            if (data.refresh_token) {
              localStorage.setItem('spotify_refresh_token', data.refresh_token);
            }
            // Clear URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('Failed to get token', await response.text());
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    handleAuth();
  }, []);

  const login = async () => {
    const verifier = generateRandomString(128);
    localStorage.setItem('spotify_code_verifier', verifier);
    const challenge = await generateCodeChallenge(verifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('scope', SCOPES.join(' '));
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', challenge);

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_code_verifier');
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
