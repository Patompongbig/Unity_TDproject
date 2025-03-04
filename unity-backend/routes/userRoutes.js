const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET Logged-in User (Includes Inventory)
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("ownedTowers") // Inventory: towers
      .populate("ownedItems");  // Inventory: items

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET Player Stats
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("stats");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH (Update) Player Stats
 *    - Expects body like: { stats: { level: 2, totalKills: 50 } }
 */
router.patch("/stats", authMiddleware, async (req, res) => {
  try {
    const { stats } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Merge the incoming stats with existing user stats
    Object.assign(user.stats, stats);

    await user.save();
    res.json(user.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET Player Gems
 */
router.get("/gems", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("totalGems");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ totalGems: user.totalGems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH (Update) Player Gems
 *    - Expects body like: { amount: 50, operation: "add" } 
 *      or { amount: 10, operation: "subtract" }
 */
router.patch("/gems", authMiddleware, async (req, res) => {
  try {
    const { amount, operation } = req.body;
    if (typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    switch (operation) {
      case "add":
        user.totalGems += amount;
        break;
      case "subtract":
        user.totalGems -= amount;
        if (user.totalGems < 0) user.totalGems = 0; // optional floor
        break;
      default:
        // If no operation given, just overwrite with exact amount (or handle how you like)
        user.totalGems = amount;
        break;
    }

    await user.save();
    res.json({ totalGems: user.totalGems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;