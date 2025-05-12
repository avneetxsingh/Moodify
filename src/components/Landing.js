// Landing.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink, Element, scroller } from 'react-scroll';
import styles from './Landing.module.css';

const Landing = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  // Track cursor position for interactive musical notes
  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX - 10}px`;
      cursorRef.current.style.top = `${e.clientY - 10}px`;
    }
  };

  // Scroll-based animations
  const { scrollYProgress } = useViewportScroll();
  const waveOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.8]);
  const taglineY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const taglineOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const constellationOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  // Floating musical notes state
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const createNote = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: Math.random() * 2 + 1,
      direction: Math.random() * 2 * Math.PI,
    });

    const initialNotes = Array.from({ length: 15 }, createNote);
    setNotes(initialNotes);

    const updateNotes = () => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          let newX = note.x + Math.cos(note.direction) * note.speed;
          let newY = note.y + Math.sin(note.direction) * note.speed;

          // Bounce off edges
          if (newX < 0 || newX > window.innerWidth) {
            note.direction = Math.PI - note.direction;
            newX = note.x + Math.cos(note.direction) * note.speed;
          }
          if (newY < 0 || newY > window.innerHeight) {
            note.direction = -note.direction;
            newY = note.y + Math.sin(note.direction) * note.speed;
          }

          // Repulse effect from cursor
          const dx = newX - cursorPosition.x;
          const dy = newY - cursorPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            newX += Math.cos(angle) * (100 - distance) * 0.05;
            newY += Math.sin(angle) * (100 - distance) * 0.05;
          }

          return { ...note, x: newX, y: newY };
        })
      );
    };

    const interval = setInterval(updateNotes, 50);
    return () => clearInterval(interval);
  }, [cursorPosition]);

  // Scroll to top function
  const scrollToTop = () => {
    scroller.scrollTo('hero', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  return (
    <div className={styles.container} ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Custom Music-Themed Cursor */}
      <motion.div
        ref={cursorRef}
        className={styles.customCursor}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 1000 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <span>♪</span>
      </motion.div>

      {/* Navigation Bar */}
      <motion.div
        className={styles.navBar}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <ScrollLink to="hero" smooth={true} duration={800} className={styles.navItem}>
          Home
        </ScrollLink>
        <ScrollLink to="about" smooth={true} duration={800} className={styles.navItem}>
          About
        </ScrollLink>
        <ScrollLink to="features" smooth={true} duration={800} className={styles.navItem}>
          Features
        </ScrollLink>
        <ScrollLink to="contact" smooth={true} duration={800} className={styles.navItem}>
          Contact
        </ScrollLink>
      </motion.div>

      {/* Hero Section */}
      <Element name="hero" className={styles.section}>
        {/* Wave Background */}
        <motion.div
          className={styles.waveBackground}
          style={{ opacity: waveOpacity }}
        >
          <div className={styles.waveLayer}></div>
          <div className={styles.waveLayer}></div>
        </motion.div>

        {/* Soundwave Visualization */}
        <motion.div
          className={styles.soundwaveBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <div className={styles.soundwaveBar}></div>
          <div className={styles.soundwaveBar}></div>
          <div className={styles.soundwaveBar}></div>
          <div className={styles.soundwaveBar}></div>
          <div className={styles.soundwaveBar}></div>
          <div className={styles.soundwaveBar}></div>
          <div className={styles.soundwaveBar}></div>
        </motion.div>

        {/* Floating Musical Notes */}
        <div className={styles.notesContainer}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className={styles.musicalNote}
              style={{ x: note.x, y: note.y }}
              animate={{ rotate: [0, 360], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              ♫
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={styles.content}
        >
          {/* Title with Gradient */}
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            whileHover={{ textShadow: '0 0 30px rgba(171, 71, 188, 0.8)' }}
          >
            Moodify
          </motion.h1>

          {/* Tagline with Scroll Reveal */}
          <motion.p
            className={styles.tagline}
            style={{ y: taglineY, opacity: taglineOpacity }}
          >
            Where Your Emotions Find Their Melody
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className={styles.buttons}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <RouterLink to="/login" className={styles.buttonPrimary}>
              Enter
              <motion.div
                className={styles.buttonRipple}
                animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </RouterLink>
            <RouterLink to="/signup" className={styles.buttonSecondary}>
              Create
              <motion.div
                className={styles.buttonRipple}
                animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              />
            </RouterLink>
          </motion.div>
        </motion.div>

        {/* Constellation Forming "Moodify" */}
        <motion.div
          className={styles.constellation}
          style={{ opacity: constellationOpacity }}
        >
          {['M', 'O', 'O', 'D', 'I', 'F', 'Y'].map((letter, i) => (
            <motion.div
              key={i}
              className={styles.constellationLetter}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
            >
              {letter}
              <div className={styles.star}></div>
            </motion.div>
          ))}
        </motion.div>
      </Element>

      {/* About Section */}
      <Element name="about" className={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className={styles.sectionContent}
        >
          <h2 className={styles.sectionTitle}>About Moodify</h2>
          <p className={styles.sectionText}>
            Moodify is a revolutionary music platform that curates playlists based on your emotions. Using advanced AI, we analyze your mood and recommend songs that resonate with how you feel. Whether you’re joyful, reflective, or in need of a pick-me-up, Moodify has the perfect soundtrack for every moment.
          </p>
        </motion.div>
      </Element>

      {/* Features Section */}
      <Element name="features" className={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className={styles.sectionContent}
        >
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.featuresGrid}>
            <motion.div
              className={styles.featureCard}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(171, 71, 188, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3>Emotion-Based Playlists</h3>
              <p>Our AI detects your mood and curates playlists that match your emotional state.</p>
            </motion.div>
            <motion.div
              className={styles.featureCard}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(171, 71, 188, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3>Personalized Recommendations</h3>
              <p>Discover new music tailored to your tastes and listening habits.</p>
            </motion.div>
            <motion.div
              className={styles.featureCard}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(171, 71, 188, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3>Seamless Experience</h3>
              <p>Enjoy a beautifully designed interface that’s easy to navigate on any device.</p>
            </motion.div>
          </div>
        </motion.div>
      </Element>

      {/* Contact Section */}
      <Element name="contact" className={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className={styles.sectionContent}
        >
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <div className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Your Message" required></textarea>
            </div>
            <button className={styles.submitButton}>Send Message</button>
          </div>
        </motion.div>
      </Element>

      {/* Back to Top Button */}
      <motion.div
        className={styles.backToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollYProgress.get() > 0.1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
      >
        ↑
      </motion.div>
    </div>
  );
};

export default Landing;