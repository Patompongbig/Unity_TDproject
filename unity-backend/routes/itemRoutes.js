const express = require('express');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get All Towers
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create a Tower
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
