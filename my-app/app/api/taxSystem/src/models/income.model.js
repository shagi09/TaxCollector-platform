const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String }, // e.g. Product Sales, Rent
  amount: { type: mongoose.Types.Decimal128, required: true },
  receiptUrl: { type: String },
  receivedDate: { type: Date },
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
