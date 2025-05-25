// controllers/auditorController.js
const Auditor = require('../models/auditor.model');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const Official = require('../models/official.model')

exports.registerAuditor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check for existing auditor
    const existing = await Auditor.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Auditor already exists with this email' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newAuditor = await Auditor.create({
      name,
      email,
      passwordHash
    });

    res.status(201).json({ message: 'Auditor registered successfully', auditorId: newAuditor._id });
  } catch (err) {
    console.error('Register Auditor Error:', err);
    res.status(500).json({ error: 'Server error while registering auditor' });
  }
};

exports.getAllAuditors = async (req, res) => {
  try {
    const auditors = await Auditor.find().select('-passwordHash');
    res.status(200).json(auditors);
  } catch (err) {
    console.error('Get Auditors Error:', err);
    res.status(500).json({ error: 'Server error while fetching auditors' });
  }
};

exports.getAuditorById = async (req, res) => {
  try {
    const { id } = req.params;
    const auditor = await Auditor.findById(id).select('-passwordHash');

    if (!auditor) {
      return res.status(404).json({ error: 'Auditor not found' });
    }

    res.status(200).json(auditor);
  } catch (err) {
    console.error('Get Auditor Error:', err);
    res.status(500).json({ error: 'Server error while fetching auditor' });
  }
};

exports.updateAuditor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const auditor = await Auditor.findById(id);
    if (!auditor) {
      return res.status(404).json({ error: 'Auditor not found' });
    }

    if (name !== undefined) auditor.name = name;
    if (email !== undefined) auditor.email = email;
    if (password !== undefined) auditor.passwordHash = await bcrypt.hash(password, 10);

    const updated = await auditor.save();
    res.status(200).json({ message: 'Auditor updated', auditorId: updated._id });
  } catch (err) {
    console.error('Update Auditor Error:', err);
    res.status(500).json({ error: 'Server error while updating auditor' });
  }
};


exports.deleteAuditor = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Auditor.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Auditor not found' });
    }

    res.status(200).json({ message: 'Auditor deleted successfully' });
  } catch (err) {
    console.error('Delete Auditor Error:', err);
    res.status(500).json({ error: 'Server error while deleting auditor' });
  }
};



exports.loginOfficial = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if official exists
    const official = await Official.findOne({ email });
    if (!official) {
      return res.status(404).json({ error: 'Official not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, official.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = signToken({ id: official._id, role: official.role });

    res.status(200).json({
      message: 'Login successful',
      token,
      official: {
        id: official._id,
        name: official.name,
        email: official.email,
        role: official.role
      }
    });

  } catch (error) {
    console.error('Official Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.registerOfficial = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await Official.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newOfficial = await Official.create({
      name,
      email,
      passwordHash
    });

    res.status(201).json({ message: 'Official registered successfully', officialId: newOfficial._id });
  } catch (error) {
    console.error('Register Official Error:', error);
    res.status(500).json({ error: 'Failed to register official' });
  }
};
