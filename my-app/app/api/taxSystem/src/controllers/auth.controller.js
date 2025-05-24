// controllers/authController.js
const TaxPayer = require('../models/taxPayer.model');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

exports.loginTaxPayer = async (req, res) => {
  try {
    const { tin, password } = req.body;

    const taxPayer = await TaxPayer.findOne({ tin });
    if (!taxPayer) {
      return res.status(404).json({ error: 'Taxpayer not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, taxPayer.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      id: taxPayer._id,
      tin: taxPayer.tin,
      name: taxPayer.name,
    };

    const token = signToken(payload);

    res.status(200).json({
      message: 'Login successful',
      token,
      taxpayer: {
        id: taxPayer._id,
        name: taxPayer.name,
        tin: taxPayer.tin,
        email: taxPayer.email,
        businessName: taxPayer.businessName
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logoutTaxPayer = async (req, res) => {
  // You can just send a success response for now
  res.status(200).json({ message: "Logged out" });
};


exports.signupTaxPayer = async (req, res) => {
  try {
    const {
      name,
      tin,
      email,
      password,
      businessName,
    } = req.body;

    const permitUrl = req.file ? `/uploads/permits/${req.file.filename}` : null;

    if (!permitUrl) {
      return res.status(400).json({ error: 'Business permit file is required' });
    }


    // Check if TIN or Email already exists
    const existingTIN = await TaxPayer.findOne({ tin });
    if (existingTIN) {
      return res.status(400).json({ error: 'TIN already registered' });
    }

    const existingEmail = await TaxPayer.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new taxpayer record (as a pending request — to be approved later)
    const newTaxPayer = new TaxPayer({
      name,
      tin,
      email,
      passwordHash,
      businessName,
      permitUrl
    });

    await newTaxPayer.save();

    res.status(201).json({
      message: 'Signup request submitted successfully. Awaiting official approval.',
      taxPayer: {
        id: newTaxPayer._id,
        name: newTaxPayer.name,
        tin: newTaxPayer.tin,
        email: newTaxPayer.email
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Failed to submit signup request' });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const taxPayerId = req.user.id; // Assumes you're attaching user ID from JWT middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    const taxPayer = await TaxPayer.findById(taxPayerId);
    if (!taxPayer) {
      return res.status(404).json({ error: 'Taxpayer not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, taxPayer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    taxPayer.passwordHash = hashedPassword;
    await taxPayer.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Server error while changing password' });
  }
};