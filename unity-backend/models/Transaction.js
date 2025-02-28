const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, // Could be towerId too
    transactionDate: { type: Date, default: Date.now },
    transactionHash: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
