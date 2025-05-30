const mongoose = require('mongoose');

const vatAuditRecordSchema = new mongoose.Schema({
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

  vatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VatPeriod', // You can define this model as a period container for VAT
    required: true,
  },
  type: {
    type: String,
    default: 'VAT',
  },
  month: { type: Number },
  year: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('VatAuditRecord', vatAuditRecordSchema);
