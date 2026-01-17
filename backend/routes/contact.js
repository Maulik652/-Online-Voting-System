const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    await Contact.create({ name, email, message });
    res.json({ success: true, message: 'Your query has been submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
