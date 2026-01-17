const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'ended'], default: 'upcoming' }
});

module.exports = mongoose.model('Election', ElectionSchema);