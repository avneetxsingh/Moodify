const express = require('express');
const cors = require('cors');
const ytSearch = require('youtube-search');
const axios = require('axios'); // Add axios to make API calls to YouTube Data API
const { spawn } = require('child_process');

const app = express();
app.use(cors());

const YT_API_KEY = 'AIzaSyCFEazl5RpKorKnbOx0XTnH5-Lz4vEyFU4'; // Replace with YouTube API key

const searchOpts = {
  maxResults: 50, // Increase to 50 to have more results to filter
  key: YT_API_KEY,
  type: 'video',
  videoCategoryId: '10', // Music category on YouTube
};

const moodEvolution = {
  'happy upbeat single official audio': 'exciting energetic single official audio',
  'sad emotional single official audio': 'calm soothing single official audio',
  'angry rap single official audio': 'chill instrumental single official audio',
  'calm soothing single official audio': 'sad emotional single official audio',
  'exciting energetic single official audio': 'happy upbeat single official audio',
  'chill instrumental single official audio': 'angry rap single official audio',
};

// In-memory queue to store songs
let songQueue = [];

// Function to fetch video details (including duration) using YouTube Data API
const fetchVideoDetails = async (videoIds) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails,snippet',
        id: videoIds.join(','),
        key: YT_API_KEY,
      },
    });
    return response.data.items;
  } catch (err) {
    console.error('Error fetching video details:', err.message);
    return [];
  }
};

// Function to parse ISO 8601 duration format (e.g., PT1H2M3S)
// This function converts the duration string to seconds
const parseDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};

// Function to filter videos
const filterVideos = async (results) => {
  // Get video IDs
  const videoIds = results.map((video) => video.id);

  // Fetch video details (including duration)
  const videoDetails = await fetchVideoDetails(videoIds);

  // Map video details back to the original results
  const filteredResults = results
    .map((video) => {
      const details = videoDetails.find((item) => item.id === video.id);
      if (!details) return null;

      const duration = parseDuration(details.contentDetails.duration);
      const title = video.title.toLowerCase();
      const channelTitle = video.channelTitle.toLowerCase();

      // Filter out videos longer than 10 minutes (600 seconds)
      if (duration > 600) return null;

      // Filter out videos with unwanted keywords in the title
      const unwantedKeywords = [
        'react',
        'reaction',
        'hour',
        'hours',
        'live',
        'cover',
        'remix',
        'extended',
        'mix',
        'compilation',
        'playlist',
      ];
      if (unwantedKeywords.some((keyword) => title.includes(keyword))) return null;

      // Prioritize videos from official artist channels
      const isOfficialChannel = channelTitle.includes('official') || channelTitle.includes('vevo') || channelTitle.includes('music');
      if (!isOfficialChannel) return null;

      return video;
    })
    .filter((video) => video !== null);

  return filteredResults;
};

app.get('/info', async (req, res) => {
  let mood = req.query.song || 'lofi chill beats';
  mood += ' official audio -reaction -live -cover -remix -hour -hours'; // Add exclusion terms
  try {
    console.log(`🔍 Searching YouTube for: ${mood}`);
    const response = await ytSearch(mood, searchOpts);
    let results = response.results;

    if (!results || results.length === 0) {
      return res.status(404).send('No video found');
    }

    // Filter results
    results = await filterVideos(results);

    if (results.length === 0) {
      return res.status(404).send('No suitable video found after filtering');
    }

    // Pick a random result for variety
    const randomIndex = Math.floor(Math.random() * results.length);
    const video = results[randomIndex];

    // Add the song to the queue (but not the current song
    const currentSong = {
      title: video.title,
      artist: video.channelTitle || 'Unknown Artist',
      url: video.link,
    };

    // Fetch additional songs to populate the queue (15 songs)
    if (songQueue.length < 15) {
      const additionalResults = results.filter((_, index) => index !== randomIndex);
      const additionalSongs = additionalResults.slice(0, 15 - songQueue.length).map((vid) => ({
        title: vid.title,
        artist: vid.channelTitle || 'Unknown Artist',
        url: vid.link,
      }));
      songQueue = [...songQueue, ...additionalSongs];
    }

    res.json(currentSong);
  } catch (err) {
    console.error('🔥 Info error:', err.message);
    res.status(500).send('Failed to fetch song info');
  }
});

app.get('/stream', async (req, res) => {
  let mood = req.query.song || 'lofi chill beats';
  mood += ' official audio -reaction -live -cover -remix -hour -hours'; // Add exclusion terms

  try {
    console.log(`🔍 Searching YouTube for: ${mood}`);
    const response = await ytSearch(mood, searchOpts);
    let results = response.results;

    if (!results || results.length === 0) {
      return res.status(404).send('No video found');
    }

    // Filter results
    results = await filterVideos(results);

    if (results.length === 0) {
      return res.status(404).send('No suitable video found after filtering');
    }

    // Pick a random result for variety
    const randomIndex = Math.floor(Math.random() * results.length);
    const videoUrl = results[randomIndex].link;
    console.log(`🎧 Streaming from: ${videoUrl}`);

    const ytdlp = spawn('yt-dlp', [
      '-f', 'bestaudio',
      '-o', '-',
      videoUrl,
    ]);

    res.setHeader('Content-Type', 'audio/mpeg');
    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on('data', (data) => {
      console.error(`❌ yt-dlp error: ${data}`);
    });

    ytdlp.on('close', (code) => {
      console.log(`✅ yt-dlp exited with code ${code}`);
    });
  } catch (err) {
    console.error('🔥 Server error:', err.message);
    res.status(500).send('Streaming failed');
  }
});

app.get('/evolve', async (req, res) => {
  const currentMood = req.query.current || 'lofi chill beats';
  const nextQuery = moodEvolution[currentMood] || 'lofi chill beats official audio';

  try {
    console.log(`🔄 Evolving from ${currentMood} to ${nextQuery}`);
    // Clear the current queue and fetch new songs for the next mood
    songQueue = [];
    const response = await ytSearch(`${nextQuery} -reaction -live -cover -remix -hour -hours`, searchOpts);
    let results = response.results;

    if (results && results.length > 0) {
      // Filter results
      results = await filterVideos(results);

      if (results.length === 0) {
        return res.status(404).send('No suitable video found after filtering');
      }

      const additionalSongs = results.slice(0, 15).map((vid) => ({
        title: vid.title,
        artist: vid.channelTitle || 'Unknown Artist',
        url: vid.link,
      }));
      songQueue = additionalSongs;
    }

    res.json({ nextQuery });
  } catch (err) {
    console.error('🔥 Evolution error:', err.message);
    res.status(500).send('Mood evolution failed');
  }
});

app.get('/vault', async (req, res) => {
  const code = req.query.code;
  if (code === 'ELITE2025') {
    const eliteQuery = 'curated elite single official audio -reaction -live -cover -remix -hour -hours';
    try {
      console.log(`🔒 Unlocking vault with: ${eliteQuery}`);
      const response = await ytSearch(eliteQuery, searchOpts);
      let results = response.results;

      if (!results || results.length === 0) {
        return res.status(404).send('No elite video found');
      }

      // Filter results
      results = await filterVideos(results);

      if (results.length === 0) {
        return res.status(404).send('No suitable elite video found after filtering');
      }

      const randomIndex = Math.floor(Math.random() * results.length);
      const videoUrl = results[randomIndex].link;
      const ytdlp = spawn('yt-dlp', ['-f', 'bestaudio', '-o', '-', videoUrl]);

      res.setHeader('Content-Type', 'audio/mpeg');
      ytdlp.stdout.pipe(res);

      ytdlp.stderr.on('data', (data) => console.error(`❌ yt-dlp error: ${data}`));
      ytdlp.on('close', (code) => console.log(`✅ yt-dlp exited with code ${code}`));
    } catch (err) {
      console.error('🔥 Vault error:', err.message);
      res.status(500).send('Vault streaming failed');
    }
  } else {
    res.status(403).send('Invalid vault code');
  }
});

// Endpoint to get the queue
app.get('/queue', (req, res) => {
  try {
    console.log('📜 Returning song queue:', songQueue);
    res.json(songQueue);
  } catch (err) {
    console.error('🔥 Queue error:', err.message);
    res.status(500).send('Failed to fetch queue');
  }
});

// Endpoint to notify the server when a song is skipped
app.post('/skip', async (req, res) => {
  try {
    if (songQueue.length > 0) {
      // Remove the first song from the queue
      const removedSong = songQueue.shift();
      console.log('⏭️ Song skipped:', removedSong);

      // Add a new song to the queue based on the current mood
      const mood = req.query.mood || 'lofi chill beats official audio'; // Fallback mood
      const response = await ytSearch(`${mood} -reaction -live -cover -remix -hour -hours`, searchOpts);
      let results = response.results;

      if (results && results.length > 0) {
        // Filter results
        results = await filterVideos(results);

        if (results.length > 0) {
          // Pick a random song that isn't already in the queue
          const availableSongs = results.filter(
            (vid) => !songQueue.some((song) => song.url === vid.link)
          );
          if (availableSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableSongs.length);
            const newSong = {
              title: availableSongs[randomIndex].title,
              artist: availableSongs[randomIndex].channelTitle || 'Unknown Artist',
              url: availableSongs[randomIndex].link,
            };
            songQueue.push(newSong);
            console.log('➕ Added new song to queue:', newSong);
          }
        }
      }

      console.log('📜 Updated queue:', songQueue);
      res.json({ success: true, queue: songQueue });
    } else {
      res.json({ success: true, queue: [] });
    }
  } catch (err) {
    console.error('🔥 Skip error:', err.message);
    res.status(500).send('Failed to skip song');
  }
});

app.listen(8000, () => {
  console.log('✅ Audio stream server running on http://localhost:8000');
});