const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['food','health','housing','sports','education'] },
  sum: { type: mongoose.Schema.Types.Double, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Cost = mongoose.model('Cost', costSchema);
module.exports = Cost;
