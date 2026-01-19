const express = require('express');
const mongoose = require('mongoose');
const pino = require('pino');
require('dotenv').config();

const app = express();
const logger = pino({ level: 'info', transport: { target: 'pino-pretty' } });
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected for Users Service'))
  .catch(err => logger.error({ err }, 'MongoDB connection error'));

// Routes
const userRoutes = require('./routes/user.routes');
app.use('/api', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ id: 'SERVER_ERROR', message: err.message });
});

module.exports = app;
