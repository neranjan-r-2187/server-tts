require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const ttsRoutes = require('./routes/ttsRoutes');
// Removed supabase

const app = express();

// Enable trust proxy for reverse proxies like Render/Vercel
app.set('trust proxy', 1);

// Allow all origins (no sensitive client-side data)
app.use(cors());
app.use(express.json());

// Serve generated audio files for playback
app.use('/audio', express.static(path.join(__dirname, 'temp_audio')));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use('/api', ttsRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});