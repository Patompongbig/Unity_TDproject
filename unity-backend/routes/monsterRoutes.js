const express = require('express');
const Monster = require('../models/Monster');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get All Towers
router.get('/', async (req, res) => {
    try {
        const monster = await Monster.find();
        res.json(monster);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create a Tower
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newMonster = new Monster(req.body);
        await newMonster.save();
        res.status(201).json(newMonster);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
