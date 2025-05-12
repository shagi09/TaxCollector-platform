const mongoose = require('mongoose');

const taxPayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tin: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  businessName: String,
  businessPermitUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('TaxPayer', taxPayerSchema);
