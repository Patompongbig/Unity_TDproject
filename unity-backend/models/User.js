const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    ownedTowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tower' }],
    ownedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    stats: {
        level: { type: Number, default: 1 },
        totalKills: { type: Number, default: 0 },
        totalWavesDefeated: { type: Number, default: 0 },
        totalPlayTime: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema, 'playerdb');
