const express = require("express");
const Tower = require("../models/Tower");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Create and Save a Tower to User's Inventory
 */
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { name, cost, maxPlacementLimit, attackRange, attackRate, damage, rarity, prefabPath } = req.body;

        // Validate inputs
        if (!name || !cost || !maxPlacementLimit || !attackRange || !attackRate || !damage || !rarity || !prefabPath) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Create a new tower
        const newTower = new Tower({
            name,
            cost,
            maxPlacementLimit,
            attackRange,
            attackRate,
            damage,
            rarity,
            prefabPath,
            ownerId: req.user.userId // Assign the current logged-in user as the owner
        });

        await newTower.save();

        // Add tower to user's inventory
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.ownedTowers.push(newTower._id);
        await user.save();

        res.status(201).json({ message: "Tower created and added to inventory!", tower: newTower });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ Get All Towers in Player's Inventory
 */
router.get("/my-towers", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("ownedTowers");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user.ownedTowers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ Remove a Tower from Inventory
 */
router.post("/remove", authMiddleware, async (req, res) => {
    try {
        const { towerId } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 1) Optional: Delay execution by 2 seconds (2000 ms)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2) Remove towerId from the user's ownedTowers array
        user.ownedTowers = user.ownedTowers.filter(t => t.toString() !== towerId);
        await user.save();

        // 3) Delete the tower from the DB
        const removedTower = await Tower.findByIdAndDelete(towerId);

        // 4) Confirm it was deleted
        const check = await Tower.findById(towerId); 
        if (check) {
            // If we still find the tower, something went wrong
            return res.status(500).json({ error: "Tower deletion failed; tower still exists in DB." });
        }

        // 5) If you'd like a full page refresh (non-AJAX), you can redirect:
        // return res.redirect("/some-route-or-page");
        //    or
        // 6) If you're doing an AJAX request, just respond with JSON and let the frontend refresh:
        return res.json({ message: "Tower successfully deleted and confirmed in DB." });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
