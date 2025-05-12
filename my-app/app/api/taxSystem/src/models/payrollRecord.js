const mongoose = require('mongoose');

const payrollRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeName: { type: String, required: true },
  salary: { type: mongoose.Types.Decimal128, required: true },
  tax: { type: mongoose.Types.Decimal128, required: true },
  description: { type: String }, // e.g. receipt URL
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' }
}, { timestamps: true });

module.exports = mongoose.model('PayrollRecord', payrollRecordSchema);
