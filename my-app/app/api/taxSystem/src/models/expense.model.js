 const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String }, // Salary, Rent, Utility, etc.
  amount: { type: Number, required: true },
  receiptUrl: { type: String },
  filename: { type: String },
  paidDate: { type: Date },
  notes: { type: String },
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' },
  year: { type: Number, required: true },
  month: { type: Number }, // ← Added month field
  vat: { type: mongoose.Types.Decimal128, default: 0.0 }, // ← VAT field
}, { timestamps: true });

// Calculate month and VAT before saving
expenseSchema.pre('save', function (next) {
  if (this.paidDate) {
    const date = new Date(this.paidDate);
    this.month = date.getMonth() + 1; // 1-12
  }

  if (this.amount) {
    const vatValue = this.amount * 0.15;
    this.vat = mongoose.Types.Decimal128.fromString(vatValue.toFixed(2));
  }

  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
