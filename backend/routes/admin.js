const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Voter = require('../models/Voter');

// Dashboard summary endpoint
router.get('/dashboard', async (req, res) => {
  try {
    const electionsCount = await Election.countDocuments();
    const votersCount = await Voter.countDocuments();
    const votesCount = await Candidate.aggregate([
      { $group: { _id: null, totalVotes: { $sum: "$votes" } } }
    ]);
    const chartData = await Candidate.find({}, 'name votes');
    res.json({
      electionsCount,
      votersCount,
      votesCount: votesCount[0]?.totalVotes || 0,
      chartData
    });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
});


// Get all elections
router.get('/elections', async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

// Add new election
router.post('/elections', async (req, res) => {
  try {
    const { title, startDate, endDate, status } = req.body;
    const election = new Election({ title, startDate, endDate, status });
    await election.save();
    res.status(201).json(election);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add election' });
  }
});

// Edit election
router.put('/elections/:id', async (req, res) => {
  try {
    const { title, startDate, endDate, status } = req.body;
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { title, startDate, endDate, status },
      { new: true }
    );
    if (!election) return res.status(404).json({ error: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update election' });
  }
});

// Delete election
router.delete('/elections/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ error: 'Election not found' });
    res.json({ message: 'Election deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete election' });
  }
});


// Get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('election', 'title');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Add new candidate
router.post('/candidates', async (req, res) => {
  try {
    const { name, party, bio, election, candidatePhoto, partyLogo } = req.body;
    const candidate = new Candidate({ name, party, bio, election, candidatePhoto, partyLogo });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add candidate' });
  }
});

// Edit candidate
router.put('/candidates/:id', async (req, res) => {
  try {
    const { name, party, bio, election, candidatePhoto, partyLogo } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { name, party, bio, election, candidatePhoto, partyLogo },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update candidate' });
  }
});

// Delete candidate
router.delete('/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete candidate' });
  }
});

// Get all voters
router.get('/voters', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json(voters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
});

// Add new voter
router.post('/voters', async (req, res) => {
  try {
    const { name, email } = req.body;
    const voter = new Voter({ name, email });
    await voter.save();
    res.status(201).json(voter);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add voter' });
  }
});

// Edit voter
router.put('/voters/:id', async (req, res) => {
  try {
    const { name, email, hasVoted, votedElection, votedCandidate } = req.body;
    const voter = await Voter.findByIdAndUpdate(
      req.params.id,
      { name, email, hasVoted, votedElection, votedCandidate },
      { new: true }
    );
    if (!voter) return res.status(404).json({ error: 'Voter not found' });
    res.json(voter);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update voter' });
  }
});

// Delete voter
router.delete('/voters/:id', async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.id);
    if (!voter) return res.status(404).json({ error: 'Voter not found' });
    res.json({ message: 'Voter deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete voter' });
  }
});

// Get voting results per candidate
router.get("/results", async (req, res) => {
  try {
    const results = await Candidate.find()
      .populate("election", "title")  // populate only election title
      .select("name party votes candidatePhoto partyLogo election"); // return only required fields

    res.json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

module.exports = router;
