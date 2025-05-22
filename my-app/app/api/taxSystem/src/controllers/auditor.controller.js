const TaxPayer = require('../models/taxPayer.model');
const { signToken } = require('../utils/jwt');
const Auditor = require('../models/auditor.model')
const bcrypt = require("bcrypt")


exports.listTaxPayers = async (req, res) => {
  try {
    const taxPayers = await TaxPayer.find().select('-passwordHash'); // Exclude password for security

    res.status(200).json({
      message: 'Taxpayers fetched successfully',
      data: taxPayers
    });
  } catch (error) {
    console.error('Error fetching taxpayers:', error);
    res.status(500).json({ error: 'Failed to retrieve taxpayer list' });
  }
};


exports.loginAuditor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if auditor exists
    const auditor = await Auditor.findOne({ email });
    if (!auditor) {
      return res.status(404).json({ error: 'Auditor not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, auditor.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = signToken({ id: auditor._id, role: 'auditor' });

    res.status(200).json({
      message: 'Login successful',
      token,
      auditor: {
        id: auditor._id,
        name: auditor.name,
        email: auditor.email
      }
    });

  } catch (error) {
    console.error('Auditor Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

