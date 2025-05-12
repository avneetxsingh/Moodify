// Login.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt } from 'react-tilt';
import styles from './Login.module.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cursorRef = useRef(null);

  // Mood preview animation 
  const moodVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  };

  // Soundwave animation 
  const soundwaveVariants = {
    idle: { scaleY: 1 },
    pulse: {
      scaleY: [1, 1.5, 1, 1.3, 1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  // Tagline letter animation
  const taglineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login({ username, password });
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
    }
  };

  const moods = ['😊', '😢', '😡', '😨', '😮', '😐'];
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMoodIndex((prev) => (prev + 1) % moods.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [moods.length]);

  const taglineText = "Where Music Meets Emotion".split('');

  const handleMouseMove = (e) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX - 10}px`;
      cursorRef.current.style.top = `${e.clientY - 10}px`;
    }
  };

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      <motion.div
        ref={cursorRef}
        className={styles.customCursor}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 1000 }}
        animate={{ x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      <motion.div
        className={styles.waveBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <div className={styles.waveLayer}></div>
        <div className={styles.waveLayer}></div>
      </motion.div>
      <Tilt options={{ max: 15, scale: 1.02, speed: 300 }}>
        <motion.div
          className={styles.box}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 100 }}
        >
          <motion.div className={styles.moodPreview}>
            <AnimatePresence mode="wait">
              <motion.div
                key={moods[currentMoodIndex]}
                variants={moodVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.moodEmoji}
              >
                {moods[currentMoodIndex]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Step Into Your Soundscape
          </motion.h2>
          <motion.div
            className={styles.tagline}
            initial="hidden"
            whileHover="visible"
          >
            {taglineText.map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={taglineVariants}
                initial="hidden"
                animate="hidden"
                whileHover="visible"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} className={styles.form}>
            <motion.div
              className={styles.inputGroup}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <label className={styles.label}>Username</label>
              <motion.input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(171, 71, 188, 0.5)' }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
            </motion.div>
            <motion.div
              className={styles.inputGroup}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <label className={styles.label}>Password</label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(171, 71, 188, 0.5)' }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
            </motion.div>
            <motion.div
              whileHover="pulse"
              className={styles.buttonWrapper}
            >
              <motion.button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                animate={isSubmitting ? { opacity: 0.7, scale: 0.95 } : { opacity: 1, scale: 1 }}
              >
                {isSubmitting ? (
                  <motion.div
                    className={styles.loader}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  />
                ) : (
                  <motion.span
                    className={styles.buttonText}
                    whileHover={{
                      y: [0, -2, 2, -2, 0],
                      transition: { duration: 0.5, repeat: Infinity },
                    }}
                  >
                    Dive Into the Vibe
                  </motion.span>
                )}
              </motion.button>
              <motion.div
                className={styles.soundwave}
                variants={soundwaveVariants}
                initial="idle"
                whileHover="pulse"
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </motion.div>
            </motion.div>
          </form>
          <motion.p
            className={styles.signup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            New user?{' '}
            <Link to="/signup" className={styles.link}>
              Sign Up
            </Link>
          </motion.p>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default Login;