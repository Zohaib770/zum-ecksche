require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/apis');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
connectDB(MONGODB_URI);

// Routes
app.use('/api', authRoutes);

// upload folder is publically available
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
