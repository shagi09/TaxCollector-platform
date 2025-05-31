const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    default: 'Violation of audit policy',
  },
}, { timestamps: true });

module.exports = mongoose.model('Blacklist', blacklistSchema);
