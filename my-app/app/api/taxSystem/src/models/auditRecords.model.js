 // models/auditRecord.model.js
const mongoose = require('mongoose');

const auditRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'PAYROLL_PAYMENT'
  amount: { type: Number, required: true },
  reference: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('AuditRecord', auditRecordSchema);
