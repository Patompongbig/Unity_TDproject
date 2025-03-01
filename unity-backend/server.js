require('dotenv').config(); // ✅ Load environment variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // ✅ Import DB connection function

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Middleware for JSON parsing

// ✅ Connect to MongoDB
connectDB();

// ✅ Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const towerRoutes = require('./routes/towerRoutes');
const itemRoutes = require('./routes/itemRoutes');
const monsterRoutes = require('./routes/monsterRoutes');
const mapRoutes = require('./routes/mapRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// ✅ Use Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/towers', towerRoutes);
app.use('/items', itemRoutes);
app.use('/monsters', monsterRoutes);
app.use('/maps', mapRoutes);
app.use('/transactions', transactionRoutes);

// ✅ Simple API Test Route
app.get('/', (req, res) => {
    res.send('Unity Backend is Running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
