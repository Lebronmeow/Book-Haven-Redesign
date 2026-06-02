import React, { useState, useRef, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import BookCharacter from '../components/BookCharacter';

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [characterState, setCharacterState] = useState('idle');
  const [lookAt, setLookAt] = useState({ x: 0, y: 0 });

  const usernameRef = useRef(null);
  const cardRef = useRef(null);

  const handleInputFocus = useCallback((field) => {
    setFocusedField(field);
    if (field === 'username') {
      setCharacterState('watching');
    } else if (field === 'password') {
      setCharacterState('hiding');
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    setFocusedField(null);
    setCharacterState('idle');
  }, []);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    if (usernameRef.current && cardRef.current) {
      const inputRect = usernameRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      const cursorX = inputRect.left - cardRect.left + e.target.selectionStart * 8;
      setLookAt({ x: cursorX - cardRect.width / 2, y: 20 });
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/login', {
        username: username,
        password: password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setCharacterState('celebrating');
        setUser(data.success);
        toast.success('Login Successful');
        setTimeout(() => navigate('/'), 800);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, #0A0A0B 0%, #050506 70%)',
        }}
      />

      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }}
      />

      <motion.div
        ref={cardRef}
        className="glass-strong rounded-2xl p-8 md:p-10 w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Book Haven"
            className="max-w-56 h-auto drop-shadow-lg"
          />
        </div>

        {/* Book Character */}
        <div className="flex justify-center mb-6">
          <BookCharacter state={characterState} lookAt={lookAt} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-serif text-gold-gradient text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-cream-300 text-center mb-8 text-sm">
          Sign in to your haven
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username field */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300/50"
            />
            <input
              ref={usernameRef}
              className="input-premium pl-11"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              onFocus={() => handleInputFocus('username')}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300/50"
            />
            <input
              className="input-premium pl-11 pr-11"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleInputFocus('password')}
              onBlur={handleInputBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-300/50 hover:text-gold-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-gold w-full text-center">
            Sign In
          </button>
        </form>

        {/* Bottom link */}
        <p className="text-center mt-6 text-sm text-cream-300">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-gold-500 hover:text-gold-400 transition-colors gold-underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
