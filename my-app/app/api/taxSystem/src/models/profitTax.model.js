const mongoose = require('mongoose');

const profitTaxSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  income: {
    type: Number,
    required: true,
    default: 0,
  },
  expense: {
    type: Number,
    required: true,
    default: 0,
  },
  profit: {
    type: Number,
    required: true,
    default: 0,
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['overdue', 'Paid', 'Pending'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ProfitTax', profitTaxSchema);
