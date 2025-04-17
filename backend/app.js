require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/apis');
const path = require('path');
const { initializeSocket  } = require('./config/socket');

const app = express();
app.use(cors());
app.use(express.json());

// constant
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Database connection
connectDB(MONGODB_URI);

// Routes
app.use('/api', authRoutes);

// upload folder is publically available
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//socket io setup
// HTTP Server erstellen
const server = http.createServer(app);
// Socket.IO Setup und Initialisierung
const io = initializeSocket(server, FRONTEND_URL);

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
