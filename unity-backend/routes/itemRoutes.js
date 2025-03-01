const express = require('express');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get Items by Owner ID (Logged-in User)
router.get('/my-items', authMiddleware, async (req, res) => {
    try {
        const items = await Item.find({ ownerId: req.user.userId }); // Get items owned by logged-in user
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get Items by Any Owner ID (Optional Public Route)
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const items = await Item.find({ ownerId: req.params.ownerId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create an Item (Automatically Assign Owner)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            ownerId: req.user.userId // ✅ Assign the logged-in user as the owner
        });
        
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
