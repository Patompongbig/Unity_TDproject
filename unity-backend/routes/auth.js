const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ✅ Register a New User
router.post('/register', async (req, res) => {
    console.log("📩 Received Data:", req.body);

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    // ✅ Hash the Password Before Storing It
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save(); // ✅ Insert into MongoDB
        res.status(201).json({ message: "✅ User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "❌ Invalid credentials" });
    }

    // ✅ Generate JWT Token for Authentication
    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.json({ token });
});

module.exports = router;
