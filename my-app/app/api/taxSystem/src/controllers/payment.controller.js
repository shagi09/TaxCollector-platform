const axios = require('axios');
const PayrollAuditRecords = require('../models/payrollAuditRecord.model'); 
const VatAuditRecords = require('../models/vatAuditRecord.model'); 
const ProfitTaxAuditRecords = require('../models/profitTaxAuditRecord.model'); 
const PayrollRecord = require('../models/payrollRecord');
const Vat = require('../models/vat.model')
const ProfitTax = require('../models/profitTax.model')

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
    console.log(req.user)
    const userId = req.user.id

    

    const tx_ref = "chewatatest-" + Date.now();

    const payroll = await PayrollRecord.findOne({ 'months._id': payrollMonthId });
    if (!payroll) return res.status(404).json({ error: 'Payroll month not found' });

    const matchedMonth = payroll.months.id(payrollMonthId);
    if (!matchedMonth) return res.status(404).json({ error: 'Month not found in payroll' });

    const audit = await PayrollAuditRecords.create({
      userId,
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
    const { amount, email, firstName, lastName, phone } = req.body;
    const { vatId } = req.params; // Correct destructuring

    // 1. Ensure vatId is provided
    if (!vatId) {
      return res.status(400).json({ message: 'VAT ID is required' });
    }

    // 2. Find the VAT entry
    const vat = await Vat.findById(vatId);
    if (!vat) {
      return res.status(404).json({ message: 'VAT record not found' });
    }

    const userId = req.user.id; // ✅ Extract user ID from auth
    const tx_ref = 'vat-' + Date.now();

    // 3. Create the VAT audit record
    const audit = await VatAuditRecords.create({
      userId, // ✅ Store the userId
      amount: amount,
      currency: 'ETB',
      email,
      firstName,
      lastName,
      phone,
      tx_ref,
      date: Date.now(),
      month: vat.month,
      year: vat.year,
      vatId: vat._id,
    });

    // 4. Prepare Chapa payment body
    const chapaBody = {
      amount: vat.amount,
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
        description: `Paying VAT for month ${vat.month}, ${vat.year}`,
      },
      meta: {
        hide_receipt: 'true',
      },
    };

    // 5. Initiate Chapa payment
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
    const { id } = req.params.id;

    const receipt = await VatAuditRecords.findById(id);
    if (!receipt) {
      return res.status(404).json({ message: 'VAT receipt not found' });
    }

    // If receipt exists and vatId is available
    if (receipt.vatId) {
      const vat = await Vat.findById(receipt.vatId);
      if (vat && vat.status !== 'Paid') {
        vat.status = 'Paid';
        await vat.save();
      }
    }

    res.status(200).json({
      message: 'VAT payment successful',
      receipt,
    });
  } catch (error) {
    console.error('VAT receipt error:', error);
    res.status(500).json({ message: 'Failed to retrieve VAT receipt' });
  }
};

// === PROFIT TAX PAYMENT CONTROLLER ===
 exports.profitTaxPayment = async (req, res) => {
  try {
    const { id: profitTaxId } = req.params;
    const { amount, email, firstName, lastName, phone } = req.body;
    const userId = req.user.id; 


    const profitTaxRecord = await ProfitTax.findById(profitTaxId);
    if (!profitTaxRecord) {
      return res.status(404).json({ message: 'Profit Tax record not found' });
    }

    const year = profitTaxRecord.year; // Fetch year from the record
    const tx_ref = 'profit-' + Date.now();

    // Create audit record
    const audit = await ProfitTaxAuditRecords.create({
      userId,
      amount,
      currency: 'ETB',
      email,
      firstName,
      lastName,
      phone,
      tx_ref,
      date: Date.now(),
      year,
      profitTaxId 
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
    if (!audit) {
      return res.status(404).json({ message: 'Profit Tax Transaction not found' });
    }

    // Update status of corresponding ProfitTax record
    if (audit.profitTaxId) {
      const profitTax = await ProfitTax.findById(audit.profitTaxId);
      if (profitTax && profitTax.status !== 'paid') {
        profitTax.status = 'paid';
        await profitTax.save();
      }
    }

    res.status(200).json({
      message: 'Profit tax payment successful',
      audit,
    });
  } catch (error) {
    console.error('Profit receipt error:', error);
    res.status(500).json({ message: 'Failed to fetch profit tax receipt' });
  }
};

