const express = require('express');
require('dotenv').config();

const requestLogger = require('./middlewares/logger.middleware');
const pino = require('pino');

const app = express();
const logger = pino({ level: 'info' });

app.use(express.json());

// request logging middleware
app.use(requestLogger);

// Routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api', adminRoutes);

// error handler uses pino logger
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ id: 'SERVER_ERROR', message: err.message });
});

module.exports = app;
