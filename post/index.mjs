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
  console.log(uri);
  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('Connected to MongoDB Atlas!');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
};

// Lambda handler for POST /api/visits
export const postVisitHandler = async (event) => {
  console.log('Lambda function invoked with event:', event); // Log event input

  try {
    console.log('Establishing database connection...');
    await connectToMongoDB();
    console.log('Database connection established.');

    console.log('Parsing request body...');
    const body = JSON.parse(event.body); // Log request body parsing step
    console.log('Request body parsed successfully:', body);

    const { token, county_id, county_name } = body;

    // Log input validation
    if (!token || !county_id || !county_name) {
      console.log('Validation failed: Missing required fields.');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Token, county_id, and county_name are required',
        }),
      };
    }

    console.log('Validation passed. Creating new visit...');
    const visit = new Visit({
      token,
      county_id,
      county_name,
      date: new Date(),
    });

    console.log('Saving visit to the database...');
    await visit.save();
    console.log('Visit saved successfully:', visit);

    // Return the saved visit
    return {
      statusCode: 201,
      body: JSON.stringify(visit),
    };
  } catch (error) {
    console.error('Error occurred during request processing:', error); // Log the error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
