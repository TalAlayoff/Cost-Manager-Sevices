//log.controller.js

const Log = require('../models/log.model');

// Get all logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ id: 'LOG_FETCH_ERROR', message: 'Failed to fetch logs: ' + error.message });
  }
};


// Add new log
exports.addLog = async (req, res) => {
  try {
    const { method, url, service } = req.body;
    if (!method || !url || !service)
      return res.status(400).json({ id: 'MISSING_FIELDS', message: 'Missing required fields: method, url, service' });
    const newLog = await Log.create({ method, url, service, timestamp: new Date() });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ id: 'LOG_ADD_ERROR', message: 'Failed to add log: ' + error.message });
  } 
};