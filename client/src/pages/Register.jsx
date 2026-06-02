import React, { useState, useRef, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import BookCharacter from '../components/BookCharacter';

export default function Register() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [characterState, setCharacterState] = useState('idle');
  const [lookAt, setLookAt] = useState({ x: 0, y: 0 });

  const textInputRef = useRef(null);
  const cardRef = useRef(null);

  const handleInputFocus = useCallback((field) => {
    if (field === 'username' || field === 'email') {
      setCharacterState('watching');
    } else {
      setCharacterState('hiding');
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    setCharacterState('idle');
  }, []);

  const handleTextInputChange = useCallback((setter) => (e) => {
    setter(e.target.value);
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const inputRect = e.target.getBoundingClientRect();
      const cursorX = inputRect.left - cardRect.left + e.target.selectionStart * 8;
      setLookAt({ x: cursorX - cardRect.width / 2, y: 20 });
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password === confirmPassword) {
      try {
        const { data } = await axios.post('/api/register', {
          username: username,
          email: email,
          password: password,
        });
        if (data.error) {
          toast.error(data.error);
        } else {
          setCharacterState('celebrating');
          setUser(data.success);
          toast.success('Registration Successful');
          setTimeout(() => navigate('/'), 800);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Password doesn't match!");
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
          Create Your Haven
        </h1>
        <p className="text-cream-300 text-center mb-8 text-sm">
          Join thousands of book lovers
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300/50"
            />
            <input
              ref={textInputRef}
              className="input-premium pl-11"
              placeholder="Username"
              value={username}
              onChange={handleTextInputChange(setUsername)}
              onFocus={() => handleInputFocus('username')}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Email field */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300/50"
            />
            <input
              className="input-premium pl-11"
              placeholder="Email"
              type="email"
              value={email}
              onChange={handleTextInputChange(setEmail)}
              onFocus={() => handleInputFocus('email')}
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

          {/* Confirm Password field */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-300/50"
            />
            <input
              className="input-premium pl-11 pr-11"
              placeholder="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleInputFocus('confirmPassword')}
              onBlur={handleInputBlur}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-300/50 hover:text-gold-500 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-gold w-full text-center">
            Create Account
          </button>
        </form>

        {/* Bottom link */}
        <p className="text-center mt-6 text-sm text-cream-300">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gold-500 hover:text-gold-400 transition-colors gold-underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
