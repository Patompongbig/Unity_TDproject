const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    name: { type: String, required: true },
    layoutData: Object, // This can store a grid, nodes, or references to tiles
    waves: [
        {
            waveNumber: Number,
            monsters: [
                { monsterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monster' }, quantity: Number }
            ]
        }
    ],
    environmentType: { type: String, enum: ['forest', 'desert', 'volcanic'], required: true },
    difficultyRating: Number
}, { timestamps: true });

module.exports = mongoose.model('Map', mapSchema, "mapdb");
