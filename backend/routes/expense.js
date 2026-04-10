const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const simplifyDebts = require('../utils/simplifyDebts');

// Get all expenses and balances for a trip
router.get('/trip/:tripId', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId })
      .populate('paidBy', 'name')
      .populate('splitAmong', 'name')
      .sort({ createdAt: -1 });

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Calculate balances
    const balances = {};
    // initialize all participants to 0
    trip.participants.forEach(p => balances[p.toString()] = 0);

    expenses.forEach(exp => {
      const payerId = exp.paidBy._id.toString();
      // the payer gets credited the total amount
      balances[payerId] = (balances[payerId] || 0) + exp.amount;

      // everyone in 'splitAmong' gets debited
      const splitCost = exp.amount / exp.splitAmong.length;
      exp.splitAmong.forEach(splitUser => {
        const uId = splitUser._id.toString();
        balances[uId] = (balances[uId] || 0) - splitCost;
      });
    });

    const simplifiedDebts = simplifyDebts(balances);

    res.json({ expenses, balances, simplifiedDebts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get expenses' });
  }
});

// Add a new expense
router.post('/', auth, async (req, res) => {
  try {
    const { tripId, description, amount, splitAmong } = req.body;
    
    // verify trip exists and user is in it
    const trip = await Trip.findById(tripId);
    if (!trip || !trip.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized or Trip not found' });
    }

    const newExpense = new Expense({
      tripId,
      description,
      amount,
      paidBy: req.user.id,
      splitAmong: splitAmong && splitAmong.length > 0 ? splitAmong : trip.participants
    });

    await newExpense.save();
    
    const populated = await Expense.findById(newExpense._id)
      .populate('paidBy', 'name')
      .populate('splitAmong', 'name');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Settle up a specific debt between two users
router.post('/settle', auth, async (req, res) => {
  try {
    const { tripId, toUserId, amount } = req.body;
    // adding an expense where payer is 'req.user.id', and splitAmong is strictly [toUserId]
    // wait, settling up means req.user pays toUserId, so req.user's balance goes up by amount, toUserId goes down.
    // So 'paidBy' = req.user.id, 'splitAmong' = [toUserId] is exactly right! 
    const settleExp = new Expense({
      tripId,
      description: 'Settled Up',
      amount,
      paidBy: req.user.id,
      splitAmong: [toUserId]
    });
    await settleExp.save();
    res.status(201).json(settleExp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to settle up' });
  }
});

module.exports = router;
