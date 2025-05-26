const axios = require('axios');
const AuditRecords = require('../models/payrollAuditRecord.model'); 
const VatAuditRecords = require('../models/vatAuditRecord.model'); 
const ProfitTaxAuditRecords = require('../models/profitTaxAuditRecord.model'); 
const PayrollRecord = require('../models/payrollRecord');

const CHAPA_SECRET_KEY = 'Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm';

// === Helper to prepare Chapa payment ===
const initiateChapaPayment = async (body) => {
  const options = {
    method: 'POST',
    url: 'https://api.chapa.co/v1/transaction/initialize',
    headers: {
      Authorization: CHAPA_SECRET_KEY,
      'Content-Type': 'application/json',
    },
    data: body,
  };
  return await axios(options);
};

// === PAYROLL PAYMENT CONTROLLER ===
exports.payrollPayment = async (req, res) => {
  try {
    const { amount, email, firstName, lastName, phone } = req.body;
    const { payrollMonthId } = req.params;

    const tx_ref = 'payroll-' + Date.now();

    const payroll = await PayrollRecord.findOne({ 'months._id': payrollMonthId });
    if (!payroll) return res.status(404).json({ error: 'Payroll month not found' });

    const matchedMonth = payroll.months.id(payrollMonthId);
    if (!matchedMonth) return res.status(404).json({ error: 'Month not found in payroll' });

    const audit = await AuditRecords.create({
      amount,
      currency: 'ETB',
      email,
      firstName,
      lastName,
      phone,
      tx_ref,
      date: Date.now(),
      payrollMonthId,
      month: matchedMonth.month,
      year: payroll.year
    });

    const chapaBody = {
      amount,
      currency: 'ETB',
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      tx_ref,
      callback_url: 'https://webhook.site/dummy-callback-url',
      return_url: `http://localhost:3000/transactions/${audit._id}`,
      customization: {
        title: 'Payroll Tax Payment',
        description: 'Payroll tax online payment',
      },
      meta: {
        hide_receipt: 'true',
      },
    };

    const response = await initiateChapaPayment(chapaBody);
    audit.checkout_url = response.data.data.checkout_url;
    await audit.save();

    res.status(201).json({
      message: 'Payroll payment initiated successfully',
      paymentUrl: audit.checkout_url,
    });

  } catch (error) {
    console.error('Payroll payment error:', error);
    res.status(500).json({ message: 'Failed to initialize payroll payment' });
  }
};

// === PAYROLL TRANSACTION RECEIPT ===
exports.getPayrollReceipt = async (req, res) => {
  try {
    const audit = await AuditRecords.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Transaction not found' });

    const payroll = await PayrollRecord.findOne({ 'months._id': audit.payrollMonthId });
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

    const targetMonth = payroll.months.id(audit.payrollMonthId);
    if (!targetMonth) return res.status(404).json({ message: 'Month not found' });

    targetMonth.taxStatus = 'paid';
    await payroll.save();

    res.status(200).json({
      message: 'Payroll marked as paid',
      updatedMonth: targetMonth,
      audit,
    });
  } catch (error) {
    console.error('Payroll receipt error:', error);
    res.status(500).json({ message: 'Failed to update payroll receipt' });
  }
};

// === VAT PAYMENT CONTROLLER ===
exports.vatPayment = async (req, res) => {
  try {
    const { amount, email, firstName, lastName, phone, month, year } = req.body;
    const tx_ref = 'vat-' + Date.now();

    const audit = await VatAuditRecords.create({
      amount,
      currency: 'ETB',
      email,
      firstName,
      lastName,
      phone,
      tx_ref,
      date: Date.now(),
      month,
      year,
    });

    const chapaBody = {
      amount,
      currency: 'ETB',
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      tx_ref,
      callback_url: 'https://webhook.site/dummy-callback-url',
      return_url: `http://localhost:3000/transactions/vat/${audit._id}`,
      customization: {
        title: 'VAT Payment',
        description: 'Paying VAT online',
      },
      meta: {
        hide_receipt: 'true',
      },
    };

    const response = await initiateChapaPayment(chapaBody);
    audit.checkout_url = response.data.data.checkout_url;
    await audit.save();

    res.status(201).json({
      message: 'VAT payment initiated',
      paymentUrl: audit.checkout_url,
    });
  } catch (error) {
    console.error('VAT payment error:', error);
    res.status(500).json({ message: 'Failed to initialize VAT payment' });
  }
};

// === VAT TRANSACTION RECEIPT ===
exports.getVatReceipt = async (req, res) => {
  try {
    const audit = await VatAuditRecords.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'VAT Transaction not found' });

    // (Optional logic for status update if needed)

    res.status(200).json({
      message: 'VAT payment successful',
      audit,
    });
  } catch (error) {
    console.error('VAT receipt error:', error);
    res.status(500).json({ message: 'Failed to fetch VAT receipt' });
  }
};

// === PROFIT TAX PAYMENT CONTROLLER ===
exports.profitTaxPayment = async (req, res) => {
  try {
    const { amount, email, firstName, lastName, phone, month, year } = req.body;
    const tx_ref = 'profit-' + Date.now();

    const audit = await ProfitTaxAuditRecords.create({
      amount,
      currency: 'ETB',
      email,
      firstName,
      lastName,
      phone,
      tx_ref,
      date: Date.now(),
      month,
      year,
    });

    const chapaBody = {
      amount,
      currency: 'ETB',
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      tx_ref,
      callback_url: 'https://webhook.site/dummy-callback-url',
      return_url: `http://localhost:3000/transactions/profit/${audit._id}`,
      customization: {
        title: 'Profit Tax Payment',
        description: 'Profit tax payment online',
      },
      meta: {
        hide_receipt: 'true',
      },
    };

    const response = await initiateChapaPayment(chapaBody);
    audit.checkout_url = response.data.data.checkout_url;
    await audit.save();

    res.status(201).json({
      message: 'Profit tax payment initiated',
      paymentUrl: audit.checkout_url,
    });
  } catch (error) {
    console.error('Profit tax payment error:', error);
    res.status(500).json({ message: 'Failed to initialize profit tax payment' });
  }
};

// === PROFIT TAX TRANSACTION RECEIPT ===
exports.getProfitReceipt = async (req, res) => {
  try {
    const audit = await ProfitTaxAuditRecords.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Profit Tax Transaction not found' });

    // (Optional logic for status update if needed)

    res.status(200).json({
      message: 'Profit tax payment successful',
      audit,
    });
  } catch (error) {
    console.error('Profit receipt error:', error);
    res.status(500).json({ message: 'Failed to fetch profit tax receipt' });
  }
};
