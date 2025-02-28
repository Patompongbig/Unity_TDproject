const mongoose = require('mongoose');

const towerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    nftMetadata: {
        contractAddress: String,
        tokenId: String
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stats: {
        damage: Number,
        range: Number,
        fireRate: Number,
        level: { type: Number, default: 1 },
        upgradeCost: Number
    },
    rarity: { type: String, enum: ['Common', 'Rare', 'Legendary'], default: 'Common' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Tower', towerSchema);
