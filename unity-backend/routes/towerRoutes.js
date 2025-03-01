const express = require('express');
const Tower = require('../models/Tower');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get Towers by Owner ID (Logged-in User)
router.get('/my-towers', authMiddleware, async (req, res) => {
    try {
        const towers = await Tower.find({ ownerId: req.user.userId }); // Get towers owned by logged-in user
        res.json(towers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get Towers by Any Owner ID (Optional Public Route)
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const towers = await Tower.find({ ownerId: req.params.ownerId });
        res.json(towers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create a Tower
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newTower = new Tower(req.body);
        await newTower.save();
        res.status(201).json(newTower);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
