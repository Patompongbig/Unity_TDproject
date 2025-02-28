const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    stats: {
        health: Number,
        speed: Number,
        damage: Number,
        armor: Number
    },
    specialAbilities: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Monster', monsterSchema);
