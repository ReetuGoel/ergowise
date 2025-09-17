const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

// In-memory cache for uploaded photos (not persistent)
let photoCache = [];

// Dummy recommendation logic
function getRecommendationFromPhoto(photoBuffer) {
  // In a real app, use ML or image analysis here
  // For demo, always return the same recommendation
  return {
    posture: 'Good',
    tips: [
      'Keep your back straight',
      'Adjust your chair height',
      'Take regular breaks'
    ]
  };
}

app.post('/api/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }
  // Store photo in cache
  photoCache.push(req.file.buffer);
  // Get recommendation
  const recommendation = getRecommendationFromPhoto(req.file.buffer);
  res.json({ recommendation });
});

app.listen(4000, () => {
  console.log('Photo upload API running on http://localhost:4000');
});
