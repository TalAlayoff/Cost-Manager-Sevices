// const Log = require('../models/log.model'); 
// const logger = require('pino')();

// module.exports = async (req, res, next) => {
//   try {
//     await Log.create({
//       method: req.method,
//       url: req.originalUrl,
//       service: process.env.SERVICE_NAME || 'unknown-service'
//     });

//     logger.info({
//       method: req.method,
//       url: req.originalUrl,
//       service: process.env.SERVICE_NAME
//     }, 'Request logged');
//   } catch (err) {
//     logger.error(err, 'Failed to log request');
//     // MUST NOT block request
//   }

//   next();
// };


const pino = require('pino');
const Log = require('../models/log.model');

const logger = pino({
  level: 'info'
});

module.exports = (req, res, next) => {

  // When response is finished, log the request
  res.on('finish', () => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      service: 'admin-service', 
      timestamp: new Date(),
    };

    // Write log to MongoDB (NON-BLOCKING)
    Log.create(logData).catch(err => {
      logger.error(err, 'Failed to save log to database');
    });

    // Write structured log with Pino
    logger.info(logData, 'HTTP request');
  });

  next();
};
