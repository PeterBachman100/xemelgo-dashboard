const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Load ENV variables
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Standard Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies

// 4. Test Route (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "Server is alive and connected to DB" });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});