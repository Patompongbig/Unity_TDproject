const express = require('express');
const Tower = require('../models/Tower');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get All Towers
router.get('/', async (req, res) => {
    try {
        const towers = await Tower.find();
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
