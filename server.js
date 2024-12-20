// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; //Import cors
import Visit from './models/Visit.js'; // Import the Visit model
import awsServerlessExpress from 'aws-serverless-express';


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
const uri = process.env.MONGO_URI; // Use environment variables for MongoDB URI
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Create a router to define your /api/visits routes
const visitRouter = express.Router();

// API to record a visit
app.post('/api/visits', async (req, res) => {
  const { token, county_id, county_name } = req.body; // Include county_name

  if (!token || !county_id || !county_name) { // Check if all required fields are provided
    return res.status(400).json({ error: 'Token, county_id, and county_name are required' });
  }

  try {
    const visit = new Visit({
      token,
      county_id,
      county_name, // Include county_name in the visit
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

// Wrap with aws-serverless-express
const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
