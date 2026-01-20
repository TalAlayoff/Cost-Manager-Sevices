const express = require('express');
const mongoose = require('mongoose');
const pino = require('pino');
require('dotenv').config();

const app = express();
const logger = pino({ level: 'info', transport: { target: 'pino-pretty' } });

app.use(express.json());

const loggerMiddleware = require('./middlewares/logger.middleware');

app.use(loggerMiddleware);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected for Costs Service'))
  .catch(err => logger.error({ err }, 'MongoDB connection error'));

// Routes
const costRoutes = require('./routes/cost.routes');
app.use('/api', costRoutes);

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ id: 'SERVER_ERROR', message: err.message });
});

module.exports = app;
