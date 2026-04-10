const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// Utility to generate a random 6-character string for trip short ID
const generateTripId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Get all trips for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .populate('creator', 'name');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Server error grabbing trips' });
  }
});

// Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const newTrip = new Trip({
      name,
      tripId: generateTripId(),
      creator: req.user.id,
      participants: [req.user.id] // creator is automatically a participant
    });
    await newTrip.save();
    
    // populating for response
    const populatedTrip = await Trip.findById(newTrip._id)
      .populate('participants', 'name email')
      .populate('creator', 'name');

    res.status(201).json(populatedTrip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Join a trip via Short ID
router.post('/join', auth, async (req, res) => {
  try {
    const { tripId } = req.body;
    const trip = await Trip.findOne({ tripId });
    
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    if (trip.participants.includes(req.user.id)) {
      return res.status(400).json({ error: 'You are already in this trip' });
    }

    trip.participants.push(req.user.id);
    await trip.save();

    const populatedTrip = await Trip.findById(trip._id)
      .populate('participants', 'name email')
      .populate('creator', 'name');

    res.json(populatedTrip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to join trip' });
  }
});

// Get single trip details
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('participants', 'name email')
      .populate('creator', 'name');
    
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Server error grabbing trip' });
  }
});

module.exports = router;
