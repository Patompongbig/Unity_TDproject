const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Get Logged-in User (Includes Inventory)
 */
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate("ownedTowers") // ✅ Ensure inventory (towers) is included
            .populate("ownedItems"); // ✅ Ensure items are included

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
