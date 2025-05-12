// Home.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Player from './Player';
import styles from './Home.module.css';

const API_URL = 'http://localhost:5000';
const AUDIO_API_URL = 'http://localhost:8000';

const moodToQuery = {
  '😊': 'happy upbeat single official audio',
  '😢': 'sad emotional single official audio',
  '😡': 'angry rap single official audio',
  '😨': 'calm soothing single official audio',
  '😮': 'exciting energetic single official audio',
  '😐': 'chill instrumental single official audio',
};

const moodNames = {
  '😊': 'Euphoria',
  '😢': 'Melancholy',
  '😡': 'Fury',
  '😨': 'Tension',
  '😮': 'Astonishment',
  '😐': 'Serenity',
};

const deepFaceToEmoji = {
  'happy': '😊',
  'sad': '😢',
  'angry': '😡',
  'fear': '😨',
  'surprise': '😮',
  'neutral': '😐',
  'disgust': '😡',
};

const moodColors = {
  '😊': '#FFD700',
  '😢': '#87CEEB',
  '😡': '#FF6347',
  '😨': '#98FB98',
  '😮': '#FFA500',
  '😐': '#D3D3D3',
};

const Home = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mood, setMood] = useState('');
  const [query, setQuery] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [audioEl, setAudioEl] = useState(null);
  const [active, setActive] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [vaultCode, setVaultCode] = useState('');
  const [lightSync, setLightSync] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songName, setSongName] = useState('');
  const [detectionError, setDetectionError] = useState('');
  const [queue, setQueue] = useState([]);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const initializeCamera = async () => {
      if (!window.location.protocol.includes('https') && window.location.hostname !== 'localhost') {
        setCameraError('Camera access requires HTTPS or localhost.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play().catch(err => setCameraError('Failed to play video: ' + err.message));
        }
      } catch (err) {
        setCameraError('Camera error: ' + err.message);
      }
    };

    initializeCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const detectMood = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setCameraError('Camera not available.');
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setDetecting(true);
      setDetectionError('');
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const image = canvasRef.current.toDataURL('image/jpeg');

      try {
        console.log('Sending image to backend for mood detection...');
        const res = await axios.post(`${API_URL}/detect-mood`, { image });
        console.log('Backend response:', res.data);

        const backendMood = res.data.mood.toLowerCase();
        const detectedMood = deepFaceToEmoji[backendMood] || '😐';
        console.log(`Mapped "${backendMood}" to emoji: ${detectedMood}`);

        handleMood(detectedMood);
        setMoodHistory(prev => [...prev.slice(-4), detectedMood]);
      } catch (err) {
        console.error('Mood detection failed:', err.message);
        setDetectionError('No face detected. Please try again.');
        handleMood('😐');
      }
      setDetecting(false);
    }, 500);
  };

  const fetchSongInfoAndStream = async (mood) => {
    try {
      const emojiMood = deepFaceToEmoji[mood];
      const query = moodToQuery[emojiMood];
      console.log(`Fetching song for query: ${query}`);
      const infoResponse = await axios.get(`${AUDIO_API_URL}/info?song=${encodeURIComponent(query)}`);
      setSongName(infoResponse.data.title);
      const newStreamUrl = `${AUDIO_API_URL}/stream?song=${encodeURIComponent(query)}&t=${Date.now()}`;
      setStreamUrl(newStreamUrl);
      if (audioEl) {
        audioEl.src = newStreamUrl;
        audioEl.load();
        if (isPlaying) {
          console.log('Attempting to play new song after fetch...');
          audioEl.play().catch(err => console.error('Play failed after fetch:', err));
        }
      }
    } catch (err) {
      console.error('Failed to fetch song info:', err);
      setSongName('Chill Instrumental');
      setStreamUrl(`${AUDIO_API_URL}/stream?song=chill%20instrumental%20official%20audio&t=${Date.now()}`);
      if (audioEl) {
        audioEl.src = `${AUDIO_API_URL}/stream?song=chill%20instrumental%20official%20audio&t=${Date.now()}`;
        audioEl.load();
        if (isPlaying) {
          console.log('Attempting to play fallback song...');
          audioEl.play().catch(err => console.error('Play failed for fallback:', err));
        }
      }
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await axios.get(`${AUDIO_API_URL}/queue`);
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
      setQueue([]);
    }
  };

  const handleMood = async (selectedMood, isVault = false) => {
    const backendMood = Object.keys(deepFaceToEmoji).find(key => deepFaceToEmoji[key] === selectedMood) || 'neutral';
    const q = isVault ? 'curated elite single official audio' : moodToQuery[selectedMood];
    console.log(`Handling mood: ${selectedMood} -> Backend mood: ${backendMood} -> Query: ${q}`);
    setMood(selectedMood);
    setQuery(q);
    setActive(true);
    triggerHapticFeedback(selectedMood);
    if (lightSync) syncAmbientLights(selectedMood);
    await fetchSongInfoAndStream(backendMood);
    await fetchQueue();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      console.log('Pausing audio...');
      audioEl?.pause();
      setIsPlaying(false);
    } else {
      console.log('Playing audio...');
      audioEl?.play().catch(err => console.error('Play failed in handlePlayPause:', err));
      setIsPlaying(true);
    }
  };

  const handleSkip = async () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      console.log('Skipping to next song:', nextSong.title);
      setSongName(nextSong.title);
      try {
        console.log('Fetching streamable URL for next song...');
        const newStreamUrl = `${AUDIO_API_URL}/stream?song=${encodeURIComponent(query)}&t=${Date.now()}`;
        setStreamUrl(newStreamUrl);

        if (audioEl) {
          audioEl.pause();
          audioEl.src = newStreamUrl;
          audioEl.load();
          const playPromise = new Promise((resolve) => {
            audioEl.oncanplay = () => {
              console.log('Audio element can play now');
              resolve();
            };
            audioEl.onerror = () => {
              console.error('Audio element error on load:', audioEl.error);
              resolve();
            };
          });
          await playPromise;
          if (isPlaying) {
            console.log('Attempting to play new song after skip...');
            try {
              await audioEl.play();
              console.log('Playback started successfully');
            } catch (err) {
              console.error('Play failed after skip:', err);
              setIsPlaying(false);
            }
          } else {
            console.log('Player is paused, not auto-playing new song');
          }
        } else {
          console.error('Audio element is not available');
        }
      } catch (err) {
        console.error('Failed to fetch streamable URL for next song:', err);
        setSongName('Chill Instrumental');
        const fallbackStreamUrl = `${AUDIO_API_URL}/stream?song=chill%20instrumental%20official%20audio&t=${Date.now()}`;
        setStreamUrl(fallbackStreamUrl);
        if (audioEl) {
          audioEl.src = fallbackStreamUrl;
          audioEl.load();
          if (isPlaying) {
            console.log('Attempting to play fallback song after skip...');
            audioEl.play().catch(err => console.error('Play failed for fallback:', err));
          }
        }
      }
      console.log('Notifying backend of skip...');
      await axios.post(`${AUDIO_API_URL}/skip?mood=${encodeURIComponent(query)}`);
      console.log('Fetching updated queue...');
      await fetchQueue();
    } else {
      console.log('Queue is empty, fetching new song based on current mood...');
      if (query) await fetchSongInfoAndStream(Object.keys(deepFaceToEmoji).find(key => deepFaceToEmoji[key] === mood));
    }
  };

  const handleMoodBoost = async () => {
    try {
      const response = await axios.get(`${AUDIO_API_URL}/evolve?current=${encodeURIComponent(query)}`);
      const { nextQuery } = response.data;
      const nextMood = Object.keys(moodToQuery).find(emoji => moodToQuery[emoji] === nextQuery) || '😐';
      await handleMood(nextMood);
    } catch (error) {
      console.error('Error evolving mood:', error);
      const boostedMood = mood === '😊' ? '😮' : mood === '😢' ? '😨' : mood;
      await handleMood(boostedMood);
    }
  };

  const handleShare = () => {
    const tweet = `Feeling ${moodNames[mood]} with "${songName}" on Moodify! #Moodify #MusicMood`;
    console.log('Sharing to X:', tweet);
    alert('Shared to X: ' + tweet);
  };

  const triggerHapticFeedback = (mood) => {
    if ('vibrate' in navigator) {
      const patterns = {
        '😊': [100, 50, 100],
        '😢': [200, 100, 200],
        '😡': [50, 50, 50, 50],
        '😨': [150, 75, 150],
        '😮': [100, 100, 100],
        '😐': [200, 200],
      };
      navigator.vibrate(patterns[mood]);
    }
  };

  const unlockVault = (code) => {
    if (code === '12345') {
      setVaultCode(code);
      handleMood(mood || '😊', true);
    } else {
      alert('Invalid Vault Code');
    }
  };

  const syncAmbientLights = (selectedMood) => {
    const color = moodColors[selectedMood] || '#D3D3D3';
    document.documentElement.style.setProperty('--mood-color', color);
  };

  const toggleLightSync = () => {
    setLightSync(!lightSync);
    if (!lightSync && mood) syncAmbientLights(mood);
  };

  return (
    <div className={styles.canvas}>
      {/* Wave Background */}
      <div className={styles.waveBackground}>
        <div className={styles.waveLayer}></div>
        <div className={styles.waveLayer}></div>
      </div>

      {/* Premium Badge */}
      <div className={styles.premiumBadge}>
        <span>Premium Features</span>
        <button
          onClick={toggleLightSync}
          className={`${styles.premiumToggle} ${lightSync ? styles.active : ''}`}
        >
          Light Sync {lightSync ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => unlockVault(prompt('Enter Vault Code:'))}
          className={styles.premiumButton}
        >
          Unlock Vault
        </button>
      </div>

      {/* Camera Frame with Mood Visualizer */}
      <div
        className={styles.frame}
        style={lightSync && mood ? { boxShadow: `0 0 20px ${moodColors[mood]}40` } : {}}
      >
        {cameraError ? (
          <div className={styles.cameraError}>{cameraError}</div>
        ) : (
          <>
            <div
              className={styles.moodVisualizer}
              style={mood ? { borderColor: moodColors[mood], boxShadow: `0 0 30px ${moodColors[mood]}80` } : {}}
            ></div>
            <video ref={videoRef} className={styles.camera} autoPlay muted playsInline />
          </>
        )}
        <canvas ref={canvasRef} width="640" height="480" className={styles.hidden} />
        {vaultCode && <div className={styles.vaultBadge}>Vault Unlocked</div>}
        {detectionError && <div className={styles.detectionError}>{detectionError}</div>}
        <div className={styles.moodArc}>
          {Object.keys(moodToQuery).map((m) => (
            <button
              key={m}
              className={`${styles.moodButton} ${mood === m ? styles.selected : ''}`}
              onClick={() => handleMood(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={detectMood}
          className={`${styles.detectButton} ${detecting ? styles.detecting : ''}`}
          disabled={detecting}
        >
          {detecting ? 'Analyzing...' : 'Detect Mood'}
        </button>
      </div>

      {/* Mood History Timeline */}
      {moodHistory.length > 0 && (
        <div className={styles.moodHistoryTimeline}>
          <h3>Mood Journey</h3>
          <div className={styles.timeline}>
            {moodHistory.map((pastMood, index) => (
              <div key={index} className={styles.timelineItem}>
                <span className={styles.timelineMood}>{pastMood}</span>
                {index < moodHistory.length - 1 && <div className={styles.timelineConnector}></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {active && (
        <Player
          mood={mood}
          songName={songName}
          streamUrl={streamUrl}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          moodColors={moodColors}
          moodNames={moodNames}
          onPlayPause={handlePlayPause}
          onSkip={handleSkip}
          onMoodBoost={handleMoodBoost}
          onShare={handleShare}
          audioEl={audioEl}
          setAudioEl={setAudioEl}
          queue={queue}
        />
      )}
    </div>
  );
};

export default Home;