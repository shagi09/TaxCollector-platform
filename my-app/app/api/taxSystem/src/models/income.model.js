const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String }, // e.g. Product Sales, Rent
  amount: { type: Number, required: true },
  receiptUrl: { type: String },
  receivedDate: { type: Date },
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' },
  year: { type: Number, required: true },
  month: { type: Number }, // ← Add month field
  vat: { type: mongoose.Types.Decimal128, default: 0.0 }, // ← VAT field
}, { timestamps: true });

// Calculate month and VAT before saving
incomeSchema.pre('save', function (next) {

  if (this.amount) {
    const vatValue = this.amount * 0.15;
    this.vat = mongoose.Types.Decimal128.fromString(vatValue.toFixed(2));
  }

  next();
});

module.exports = mongoose.model('Income', incomeSchema);
