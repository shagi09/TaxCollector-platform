const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['official'], // default role for city officials
    default: 'official',
  },
}, { timestamps: true });

module.exports = mongoose.model('Official', officialSchema);
