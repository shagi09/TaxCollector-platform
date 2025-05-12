const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String }, // Salary, Rent, Utility, etc.
  amount: { type: Number, required: true },
  receiptUrl: { type: String },
  paidDate: { type: Date },
  notes: { type: String },
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
