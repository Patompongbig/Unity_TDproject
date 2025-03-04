const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    nftMetadata: {
        contractAddress: String,
        tokenId: String
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['skin', 'consumable', 'resource'], required: true },
    stats: {
        effectPower: Number,
        duration: Number
    },
    rarity: { type: String, enum: ['Common', 'Rare', 'Legendary'], default: 'Common' }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema, "itemdb");
