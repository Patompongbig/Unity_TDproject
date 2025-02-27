require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Ensures JSON parsing

// ✅ Debugging Middleware (Logs incoming requests)
app.use((req, res, next) => {
    console.log("🔹 Incoming Request:", req.method, req.url);
    console.log("🔹 Headers:", req.headers);
    console.log("🔹 Body:", req.body);
    next();
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB (Docker)"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// ✅ Ensure This Line Exists
app.use('/auth', require('./routes/auth'));

// ✅ Simple API Test Route
app.get('/', (req, res) => {
    res.send('Unity Backend is Running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
