// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; //Import cors
import Visit from './models/Visit.js'; // Import the Visit model

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Enable CORS for all origins (or specify the allowed origins)
app.use(cors()); // This will allow all origins by default

// OR you can specify allowed origins
// app.use(cors({
//   origin: 'http://localhost:4000'  // Allow only this frontend URL
// }));

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// API to record a visit
app.post('/api/visits', async (req, res) => {
  const { token, county_id } = req.body;

  if (!token || !county_id) {
    return res.status(400).json({ error: 'Token and county_id are required' });
  }

  try {
    const visit = new Visit({
      token,
      county_id,
      date: new Date(),
    });

    await visit.save();
    res.status(201).json(visit); // Respond with the saved visit data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API to fetch all visits for a user (identified by token)
app.get('/api/visits/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const visits = await Visit.find({ token }).sort({ date: -1 }); // Sort by date (latest first)
    res.status(200).json(visits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
