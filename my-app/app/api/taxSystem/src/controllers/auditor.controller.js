const TaxPayer = require('../models/taxPayer.model');
const { signToken } = require('../utils/jwt');
const Auditor = require('../models/auditor.model')
const bcrypt = require("bcrypt")
const Income = require('../models/income.model')
const Expense = require('../models/expense.model')
const PayrollAuditRecords = require('../models/payrollAuditRecord.model');
const VatAuditRecords = require('../models/vatAuditRecord.model');
const ProfitTaxAuditRecords = require('../models/profitTaxAuditRecord.model');
const Blacklist = require('../models/blacklist.model')
const Notification = require('../models/notification.model')
const mongoose = require('mongoose');

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

exports.getTaxpayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const taxpayer = await TaxPayer.findById(id);

    if (!taxpayer) {
      return res.status(404).json({ message: 'Taxpayer not found' });
    }

    res.status(200).json({ taxpayer });
  } catch (error) {
    console.error('Error fetching taxpayer:', error);
    res.status(500).json({ message: 'Failed to fetch taxpayer' });
  }
};

exports.getIncomesByYear = async (req, res) => {
  try {
    const { id, year } = req.params;

    const incomes = await Income.find({ userId: id, year });

    res.status(200).json({ incomes });
  } catch (error) {
    console.error('Error fetching incomes by year:', error);
    res.status(500).json({ message: 'Failed to fetch incomes for the year' });
  }
};

exports.getIncomesByYearAndMonth = async (req, res) => {
  try {
    const { id, year, month } = req.params;

    const incomes = await Income.find({ userId: id, year, month });

    res.status(200).json({ incomes });
  } catch (error) {
    console.error('Error fetching incomes by year and month:', error);
    res.status(500).json({ message: 'Failed to fetch incomes for the year and month' });
  }
};

exports.getExpensesByYear = async (req, res) => {
  try {
    const { id, year } = req.params;

    const expenses = await Expense.find({ userId: id, year });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses by year:', error);
    res.status(500).json({ message: 'Failed to fetch expenses for the year' });
  }
};

exports.getExpensesByYearAndMonth = async (req, res) => {
  try {
    const { id, year, month } = req.params;

    const expenses = await Expense.find({ userId: id, year, month });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses by year and month:', error);
    res.status(500).json({ message: 'Failed to fetch expenses for the year and month' });
  }
};

exports.getPayrollAuditByTaxpayer = async (req, res) => {
  try {
    const { taxpayerId, year, month } = req.params;

    const records = await PayrollAuditRecords.find({
      userId: taxpayerId,
      year: parseInt(year),
      month : parseInt(month)
    });
    const payrollMonthId = records.payrollMonthId
    res.status(200).json({ records, payrollMonthId });
  } catch (error) {
    console.error('Error fetching payroll audit records:', error);
    res.status(500).json({ message: 'Failed to fetch payroll audit records' });
  }
};

exports.getVatAuditByTaxpayer = async (req, res) => {
  try {
    const { taxpayerId, year, month } = req.params;

    const records = await VatAuditRecords.find({
      userId: taxpayerId,
      year: parseInt(year),
      month : parseInt(month)
    });

    const vatId = records.vatId; // Assuming vatId is part of the records
    res.status(200).json({ records, vatId });
  } catch (error) {
    console.error('Error fetching VAT audit records:', error);
    res.status(500).json({ message: 'Failed to fetch VAT audit records' });
  }
};

exports.getProfitTaxAuditByTaxpayer = async (req, res) => {
  try {
    const { taxpayerId, year } = req.params;

    const records = await ProfitTaxAuditRecords.find({
      userId: taxpayerId,
      year: parseInt(year),
    });
    const profitTaxId = records.profitTaxId; // Assuming profitTaxId is part of the records
    res.status(200).json({ records, profitTaxId });
  } catch (error) {
    console.error('Error fetching profit tax audit records:', error);
    res.status(500).json({ message: 'Failed to fetch profit tax audit records' });
  }
};

 exports.addUserToBlacklist = async (req, res) => {
  try {
    let { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required in params' });
    }

     console.log(userId)
     
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

   

    // Cast userId to ObjectId
    userId = new mongoose.Types.ObjectId(userId);

    const auditType = 'general'; // Replace with your logic

    // Create blacklist entry
    const blacklist = await Blacklist.create({
      userId,
    });

    // Send notification
    const notification = await Notification.create({
      userId,
      message: `You have been blacklisted due to a ${auditType.toLowerCase()} audit issue.`,
    });

    res.status(201).json({
      message: 'User blacklisted and notified.',
      blacklist,
      notification,
    });
  } catch (error) {
    console.error('addUserToBlacklist error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};