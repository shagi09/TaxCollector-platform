const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  auditRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  auditType: {
    type: String,
    enum: ['VAT', 'PROFIT_TAX', 'PAYROLL'],
    required: true,
  },
  reason: {
    type: String,
    default: 'Violation of audit policy',
  },
}, { timestamps: true });

module.exports = mongoose.model('Blacklist', blacklistSchema);
