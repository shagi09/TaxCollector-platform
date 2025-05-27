const mongoose = require('mongoose');

const vatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaxPayer', // Replace 'User' if your user model is named differently (e.g., 'Taxpayer')
    required: true,
  },
  incomeVat: {
    type: Number,
    required: true,
    min: 0,
  },
  expenseVat: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vat', vatSchema);
