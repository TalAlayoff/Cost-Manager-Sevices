const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  method: { type: String, required: true },
  url: { type: String, required: true },
  ip: { type: String },
  service: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
