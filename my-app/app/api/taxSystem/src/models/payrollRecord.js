 const mongoose = require('mongoose');

const record = new mongoose.Schema({
  employeeName: { type: String, required: true },
  salary: { type: Number, required: true },
  tax: { type: mongoose.Types.Decimal128, required: true },
  description: { type: String },
  taxPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaxPeriod' },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const payrollRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  months: [
    {
      month: { type: Number, required: true }, // 1 to 12
      records: [record],
      taxStatus: { 
          type: String, 
          enum: ['pending', 'paid', 'overdue'], 
          default: 'pending' 
        },
      penalty: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('PayrollRecord', payrollRecordSchema);
