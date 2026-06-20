// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
// Replace with your local URI or MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user_analytics';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2. Data Schema
const EventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  eventType: { type: String, enum: ['page_view', 'click'], required: true },
  pageUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  clickX: { type: Number },
  clickY: { type: Number }
});

const Event = mongoose.model('Event', EventSchema);

// 3. API Endpoints

// Endpoint A: Receive and store events
app.post('/api/events', async (req, res) => {
  try {
    const { sessionId, eventType, pageUrl, timestamp, clickCoordinates } = req.req_body || req.body;
    
    const newEvent = new Event({
      sessionId,
      eventType,
      pageUrl,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      clickX: clickCoordinates ? clickCoordinates.x : undefined,
      clickY: clickCoordinates ? clickCoordinates.y : undefined
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint B: Fetch all unique sessions with event counts
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          totalEvents: { $sum: 1 },
          lastActive: { $max: '$timestamp' }
        }
      },
      { $sort: { lastActive: -1 } }
    ]);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint C: Fetch all events for a specific session (ordered chronologically)
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const events = await Event.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint D: Fetch click data for a specific page (for heatmaps)
app.get('/api/heatmap', async (req, res) => {
  try {
    const { pageUrl } = req.query;
    if (!pageUrl) {
      return res.status(400).json({ success: false, error: 'pageUrl query parameter is required' });
    }
    const clicks = await Event.find(
      { pageUrl, eventType: 'click' },
      'clickX clickY timestamp'
    );
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
});