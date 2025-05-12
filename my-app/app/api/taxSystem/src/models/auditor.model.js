const mongoose = require('mongoose');

const auditorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Auditor', auditorSchema);
