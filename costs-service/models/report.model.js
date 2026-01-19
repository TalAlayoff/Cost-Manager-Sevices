const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  costs: { type: Object, required: true } // stores precomputed category grouping
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
