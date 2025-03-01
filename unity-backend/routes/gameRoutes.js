const express = require('express');
const router = express.Router();

// Define the status endpoint
router.get('/status', (req, res) => {
    res.json({ message: "Game server is running!", status: "online" });
});

module.exports = router;
