const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  bio: { type: String },
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  votes: { type: Number, default: 0 },
  candidatePhoto: { type: String },
  partyLogo: { type: String }
});

module.exports = mongoose.model('Candidate', CandidateSchema);