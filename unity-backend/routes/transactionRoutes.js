const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this verifies JWT

const router = express.Router();

// ✅ Get Logged-in User (Using JWT)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Extract user ID from authMiddleware
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
