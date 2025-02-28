const express = require('express');
const Map = require('../models/Map');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get All Towers
router.get('/', async (req, res) => {
    try {
        const map = await Map.find();
        res.json(map);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create a Tower
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newMap = new Map(req.body);
        await newMap.save();
        res.status(201).json(newMap);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
