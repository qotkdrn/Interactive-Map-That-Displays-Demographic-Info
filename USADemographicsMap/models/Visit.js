// models/Visit.js
import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  token: { type: String, required: true },
  county_id: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
