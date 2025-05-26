 // models/taxPeriod.model.js
const mongoose = require('mongoose');

const taxPeriodSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
});

module.exports = mongoose.model('TaxPeriod', taxPeriodSchema);
