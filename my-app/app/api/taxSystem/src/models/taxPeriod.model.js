const mongoose = require('mongoose');

const taxPeriodSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  taxPeriodId: {
    type: String,
    unique: true,
  },
});

// Automatically generate taxPeriodId before saving
taxPeriodSchema.pre('save', function (next) {
  this.taxPeriodId = `${this.year}-${String(this.month).padStart(2, '0')}`;
  next();
});

module.exports = mongoose.model('TaxPeriod', taxPeriodSchema);
