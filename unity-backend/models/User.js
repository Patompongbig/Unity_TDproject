const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// ✅ Force Mongoose to Use "playerdb" Instead of "users"
module.exports = mongoose.model('User', UserSchema, 'playerdb');
