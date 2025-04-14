const express = require('express');
const cors = require('cors');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const donHangRoutes = require('./routes/donHangRoutes');
const mucTieuRoutes = require('./routes/mucTieuRoutes');
const quyTrinhRoutes = require('./routes/quyTrinhRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(`${config.API_PREFIX}`, userRoutes);
app.use(`${config.API_PREFIX}`, donHangRoutes);
app.use(`${config.API_PREFIX}`, mucTieuRoutes);
app.use(`${config.API_PREFIX}`, quyTrinhRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
