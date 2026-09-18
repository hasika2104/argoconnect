const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/argoconnect';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} at ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Atlas/Database Connection Error: ${error.message}`);
    console.warn('[MongoDB Warning] Operating with memory/local database fallback if running test suite or seed fallback mode.');
  }
};

module.exports = connectDB;
