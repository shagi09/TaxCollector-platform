const mongoose = require('mongoose');

const record = new mongoose.Schema({
  employeeName: { type: String, required: true },
  salary: { type: Number, required: true },
  tax: { type: mongoose.Types.Decimal128, required: true },
  description: { type: String },
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

// 👇 Create a separate schema for month so it can have its own _id
const monthSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  records: [record],
  taxStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
  penalty: { type: Number, default: 0 },
}, { _id: true }); // <-- give each month its own ID

const payrollRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  months: [monthSchema],
}, { timestamps: true });

module.exports = mongoose.model('PayrollRecord', payrollRecordSchema);
