const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ✅ Register a New User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "❌ All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash: hashedPassword });

    try {
        await newUser.save();

        // ✅ สร้าง JWT Token หลังจากสมัครสำเร็จ
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secretkey');

        // ✅ ส่ง token กลับให้ Unity ใช้
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(400).json({ error: "❌ Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey');
    res.json({ token });
});

module.exports = router;
