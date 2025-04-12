const mongoose = require('mongoose');

const connectDB = async (MONGODB_URI) => {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error("MongoDB connection error:", err));
};

module.exports = connectDB;
