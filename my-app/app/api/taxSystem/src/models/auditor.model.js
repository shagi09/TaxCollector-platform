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
  },
  role: {
    type: String,
    enum: ['auditor'], // default role for city officials
    default: 'auditor',
  }
}, { timestamps: true });

module.exports = mongoose.model('Auditor', auditorSchema);
