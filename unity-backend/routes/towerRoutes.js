const express = require("express");
const Tower = require("../models/Tower");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * ✅ Create and Save a Tower to User's Inventory
 */
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { name, cost, maxPlacementLimit, attackRange, attackRate, damage, rarity, aoeRadius, prefabPath } = req.body;

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
            aoeRadius,
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

        // Transform towers to include towerId instead of _id
        const transformedTowers = user.ownedTowers.map(tower => ({
            towerId: tower._id.toString(), // Convert ObjectId to string
            name: tower.name,
            cost: tower.cost,
            maxPlacementLimit: tower.maxPlacementLimit,
            attackRange: tower.attackRange,
            attackRate: tower.attackRate,
            damage: tower.damage,
            rarity: tower.rarity,
            aoeRadius: tower.aoeRadius,
            prefabPath: tower.prefabPath
        }));

        res.json(transformedTowers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ Remove a Tower from Inventory
 */
router.post("/remove", authMiddleware, async (req, res) => {
    try {
        const towerId = new mongoose.Types.ObjectId(req.body.towerId); // 🔥 Convert to ObjectId
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // ✅ Debug logs
        console.log("[DEBUG] User ID from token:", req.user.userId.toString());
        console.log("[DEBUG] Tower ID to delete:", towerId);
        console.log("[DEBUG] User's ownedTowers:", user.ownedTowers);

        // Check ownership using `.equals()` instead of `toString()`
        const ownsTower = user.ownedTowers.some(t => t.equals(towerId));
        if (!ownsTower) {
            return res.status(403).json({ error: "User does not own this tower" });
        }

        // Remove tower from user's inventory
        user.ownedTowers = user.ownedTowers.filter(t => !t.equals(towerId));
        await user.save();

        // Delete tower from database
        const deletedTower = await Tower.findByIdAndDelete(towerId);
        if (!deletedTower) {
            return res.status(404).json({ error: "Tower not found" });
        }

        res.json({ message: "Tower deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
