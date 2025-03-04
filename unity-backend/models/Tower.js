const mongoose = require("mongoose");

const towerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        cost: { type: Number, required: true }, // Cost of placing the tower
        maxPlacementLimit: { type: Number, required: true }, // Max placements allowed
        attackRange: { type: Number, required: true },
        attackRate: { type: Number, required: true },
        damage: { type: Number, required: true },
        rarity: {
            type: String,
            enum: ["Common", "Rare", "Epic", "Legendary"],
            required: true
        },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Player who owns the tower
        prefabPath: { type: String, required: true } // Reference to Unity prefab
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tower", towerSchema, "towerdb");
