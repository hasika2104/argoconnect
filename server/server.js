const app = require('./app');
const connectDB = require('./config/db');
const { autoSeedIfEmpty } = require('./scripts/seed');
require('dotenv').config({ path: '../.env' });

const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas / Managed Database
connectDB().then(async () => {
  await autoSeedIfEmpty();
  app.listen(PORT, () => {
    console.log(`[Argoconnect Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Health Check] http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error('[Server Initialization Error]', err.message);
  process.exit(1);
});

