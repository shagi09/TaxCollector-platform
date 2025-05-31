const mongoose = require('mongoose');

const profitTaxAuditRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  tx_ref: { type: String, required: true, unique: true },
  checkout_url: { type: String },
  date: { type: Date },

  profitTaxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfitTaxPeriod', // Define this model for organizing annual profit tax entries
    required: true,
  },
  type: {
    type: String,
    default: 'PROFIT',
  },
  year: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('ProfitTaxAuditRecord', profitTaxAuditRecordSchema);
