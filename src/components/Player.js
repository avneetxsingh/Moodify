// Player.js
import React, { useEffect, useState } from 'react';
import styles from './Player.module.css';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaRandom,
  FaRedo,
  FaSyncAlt,
  FaShareAlt,
  FaVolumeUp,
} from 'react-icons/fa';

const Player = ({
  mood,
  songName,
  streamUrl,
  isPlaying,
  setIsPlaying,
  moodColors,
  moodNames,
  onPlayPause,
  onSkip,
  onMoodBoost,
  onShare,
  audioEl,
  setAudioEl,
  queue = [],
}) => {
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(1);
  const [moodIntensity, setMoodIntensity] = useState(50);
  const [waveformBars, setWaveformBars] = useState(Array(20).fill(0));

  useEffect(() => {
    if (audioEl) {
      audioEl.addEventListener('timeupdate', () => {
        setCurrentTime(audioEl.currentTime);
        setDuration(audioEl.duration || 0);
      });
      audioEl.volume = volume;
    }
  }, [audioEl, volume]);

  // Simulate Waveform Animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setWaveformBars(waveformBars.map(() => Math.random() * 30 + 10));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioEl) audioEl.currentTime = seekTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioEl) audioEl.volume = newVolume;
  };

  const handleMoodIntensityChange = (e) => {
    setMoodIntensity(e.target.value);
    // Logic to adjust query based on intensity can be added here
  };

  const toggleShuffle = () => setShuffle(!shuffle);
  const toggleRepeat = () => setRepeat(!repeat);

  const handleError = (e) => {
    console.error('Audio playback error:', e);
    console.error('Error code:', audioEl?.error?.code);
    console.error('Error message:', audioEl?.error?.message);
    setIsPlaying(false);
  };

  // Mock Lyrics Data
  const lyrics = `🎵 This is a sample lyric line...\nFeel the rhythm, feel the beat...\nLet the music take you away... 🎵`;

  return (
    <>
      <div
        className={`${styles.player} ${playerExpanded ? styles.expanded : ''}`}
        onClick={() => !playerExpanded && setPlayerExpanded(true)}
      >
        <div className={styles.playerContent}>
          {playerExpanded && (
            <div className={styles.playerHeader}>
              <button
                className={styles.minimizeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setPlayerExpanded(false);
                }}
              >
                ↓
              </button>
            </div>
          )}

          {playerExpanded && (
            <div className={styles.albumArt}>
              <div
                className={styles.artPulse}
                style={{ background: moodColors[mood], boxShadow: `0 0 30px ${moodColors[mood]}80` }}
              ></div>
              <div className={styles.waveform}>
                {waveformBars.map((height, index) => (
                  <div
                    key={index}
                    className={styles.waveformBar}
                    style={{
                      height: `${height}px`,
                      background: `linear-gradient(180deg, ${moodColors[mood]}, #FFFFFF)`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.infoAndControls}>
            <div className={styles.musicInfo}>
              <div className={styles.songInfoWrapper}>
                <span className={`${styles.songName} ${styles.marquee}`}>
                  {songName || 'Loading...'}
                </span>
                <span className={styles.moodIcon}>{mood}</span>
              </div>
              {playerExpanded && <span className={styles.moodName}>{moodNames[mood]}</span>}
            </div>

            <div className={styles.controlButtons}>
              <button onClick={(e) => { e.stopPropagation(); onPlayPause(); }} className={styles.controlBtn}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onSkip(); }} className={styles.controlBtn}>
                <FaForward />
              </button>
              {playerExpanded && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); toggleShuffle(); }} className={`${styles.controlBtn} ${shuffle ? styles.activeControl : ''}`}>
                    <FaRandom />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleRepeat(); }} className={`${styles.controlBtn} ${repeat ? styles.activeControl : ''}`}>
                    <FaRedo />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onMoodBoost(); }} className={styles.controlBtn}>
                    <FaSyncAlt /> Mood
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onShare(); }} className={styles.controlBtn}>
                    <FaShareAlt />
                  </button>
                </>
              )}
            </div>
          </div>

          {playerExpanded && (
            <div className={styles.progressBar}>
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className={styles.progressInput}
                style={{ background: `linear-gradient(to right, ${moodColors[mood]} ${(currentTime / duration) * 100}%, #ECEFF1 0%)` }}
              />
              <span>{formatTime(duration)}</span>
            </div>
          )}

          {playerExpanded && (
            <div className={styles.controlsExtended}>
              <div className={styles.volumeControl}>
                <FaVolumeUp />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className={styles.volumeSlider}
                  style={{ background: `linear-gradient(to right, ${moodColors[mood]} ${volume * 100}%, #ECEFF1 0%)` }}
                />
              </div>
              <div className={styles.moodIntensityControl}>
                <span>Mood Intensity</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={moodIntensity}
                  onChange={handleMoodIntensityChange}
                  className={styles.moodIntensitySlider}
                  style={{ background: `linear-gradient(to right, ${moodColors[mood]} ${moodIntensity}%, #ECEFF1 0%)` }}
                />
              </div>
            </div>
          )}

          {playerExpanded && (
            <div className={styles.lyricsSection}>
              <h3 className={styles.lyricsTitle}>Lyrics</h3>
              <pre className={styles.lyricsContent}>{lyrics}</pre>
            </div>
          )}

          {playerExpanded && (
            <div className={styles.queueSection}>
              <h3 className={styles.queueTitle}>Up Next</h3>
              {queue && queue.length > 0 ? (
                <div className={styles.queueList}>
                  {queue.map((song, index) => (
                    <div key={index} className={styles.queueItem}>
                      <span className={styles.queueSongName}>{song.title}</span>
                      <span className={styles.queueArtist}>{song.artist}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.queueEmpty}>No songs in the queue.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <audio
        ref={setAudioEl}
        src={streamUrl}
        onEnded={shuffle ? onSkip : repeat ? () => audioEl.currentTime = 0 : null}
        onPlay={() => {
          console.log('Audio playback started');
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log('Audio playback paused');
          setIsPlaying(false);
        }}
        onError={handleError}
      />
    </>
  );
};

export default Player;