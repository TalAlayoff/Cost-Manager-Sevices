const express = require('express');
const pino = require('pino');
require('dotenv').config();

const app = express();
const logger = pino({ level: 'info', transport: { target: 'pino-pretty' } });

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, service: 'admin-service' });
  next();
});

// Routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api', adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ id: 'SERVER_ERROR', message: err.message });
});

module.exports = app;
