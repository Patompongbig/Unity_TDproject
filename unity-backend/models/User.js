const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },

        ownedTowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tower" }], // Tower inventory
        ownedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],   // Item inventory

        totalGems: {type: Number, default: 400},

        stats: {
            level: { type: Number, default: 1 },
            totalKills: { type: Number, default: 0 },
            farthestWave: { type: Number, default: 0 }, // New field
            totalWavesDefeated: { type: Number, default: 0 },
            totalPlayTime: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "playerdb");
