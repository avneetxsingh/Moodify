// DetectMood.js
// This component handles the mood detection and music streaming functionality. - Jasnoor Write code after discussing
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './DetectMood.module.css';
import CameraOverlay from '../components/CameraOverlay';

const API_URL = 'http://localhost:5000';
const AUDIO_API_URL = 'http://localhost:8000';

const moodToQuery = {
  happy: "happy upbeat music",
  sad: "lofi chill emotional songs",
  angry: "aggressive rap or metal",
  fearful: "soft soothing ambient music",
  surprised: "exciting high-energy music",
  neutral: "focus instrumental or ambient"
};

const DetectMood = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [query, setQuery] = useState('');
  const [audioEl, setAudioEl] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }).catch(() => setError("Camera access denied."));
  }, []);

  const handleMoodResult = async (detected) => {
    setMood(detected);
    const q = moodToQuery[detected] || "mood music";
    setQuery(q);
    const url = `${AUDIO_API_URL}/stream?song=${encodeURIComponent(q)}`;
    setStreamUrl(url);
    setScanned(true);
  };

  const detectMood = async () => {
    setLoading(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const image = canvasRef.current.toDataURL('image/jpeg');

    try {
      const res = await axios.post(`${API_URL}/detect-mood`, { image });
      await handleMoodResult(res.data.mood);
    } catch {
      setError("Failed to detect mood or stream.");
    }
    setLoading(false);
  };

  const handleManualMood = async (mood) => {
    await handleMoodResult(mood);
  };

  const handlePlay = () => audioEl && audioEl.play();
  const handlePause = () => audioEl && audioEl.pause();
  const handleSkip = () => {
    if (query) setStreamUrl(`${AUDIO_API_URL}/stream?song=${encodeURIComponent(query)}`);
  };

  return (
    <div className={styles.container}>
      {!scanned && (
        <>
          <video ref={videoRef} width="640" height="480" className={styles.video} />
          <CameraOverlay />
          <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
          <button onClick={detectMood} className={styles.scanButton}>
            {loading ? 'Analyzing...' : 'Detect Mood 🎯'}
          </button>

          {/* Manual Mood Buttons */}
          <div className={styles.moodButtons}>
            {Object.keys(moodToQuery).map((moodType) => (
              <button
                key={moodType}
                className={styles.manualMoodBtn}
                onClick={() => handleManualMood(moodType)}
              >
                {moodType.charAt(0).toUpperCase() + moodType.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}

      {scanned && (
        <div className={styles.playerWrap}>
          <div className={styles.circle}>
            <p className={styles.moodText}>{mood.toUpperCase()}</p>
            <p className={styles.songTitle}>{query}</p>
            <div className={styles.controls}>
              <button onClick={handlePlay}>▶</button>
              <button onClick={handlePause}>⏸</button>
              <button onClick={handleSkip}>⏭</button>
            </div>
          </div>
          <audio
            ref={setAudioEl}
            src={streamUrl}
            autoPlay
            onEnded={handleSkip}
          />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default DetectMood;
