const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const eventRoutes = require('./routes/eventRoutes');

// 1. Load ENV variables
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Standard Middleware
app.use(cors());
app.use(express.json());

// 4. Test Route (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "Server is alive and connected to DB" });
});

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});