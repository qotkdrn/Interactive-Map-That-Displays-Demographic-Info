import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Visit from './models/Visit.js'; // Import your Visit model

// Load environment variables
dotenv.config();

// MongoDB connection (ensure it's initialized only once)
let isConnected = false;

const connectToMongoDB = async () => {
  if (isConnected) return;
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('Connected to MongoDB Atlas!');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
};

// Lambda handler for GET /api/visits/:token
export const getVisitsHandler = async (event) => {
  try {
    await connectToMongoDB();

    // Extract token from pathParameters
    const { token } = event.pathParameters;

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token is required' }),
      };
    }

    // Fetch visits from MongoDB
    const visits = await Visit.find({ token }).sort({ date: -1 });

    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify(visits),
    };
  } catch (error) {
    console.error('Error fetching visits:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
