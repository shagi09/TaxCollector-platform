const axios = require('axios');
const PayrollAuditRecords = require('../models/payrollAuditRecord.model'); 
const VatAuditRecords = require('../models/vatAuditRecord.model'); 
const ProfitTaxAuditRecords = require('../models/profitTaxAuditRecord.model'); 
const PayrollRecord = require('../models/payrollRecord');
const Vat = require('../models/vat.model')
const ProfitTax = require('../models/profitTax.model')

// === PAYROLL PAYMENT CONTROLLER ===
 exports.payrollPayment = async (req, res) => {
  try {
    const { amount, email, firstName, lastName, phone } = req.body;
    const { payrollMonthId } = req.params;
    console.log(req.user)
    console.log({ amount, email, firstName, lastName, phone } )
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

    audit.save()
  
    const body = {
      "amount": String(amount),
      "currency": 'ETB',
      "email":email,
      "first_name": firstName,
      "last_name": lastName,
      "phone_number": phone,
      "tx_ref": tx_ref,
       "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      "return_url": `http://localhost:3000/transaction`,
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments",
      "meta[hide_receipt]": "true"
    };

       const options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm", // Replace with your Chapa test key
          "Content-Type": "application/json",
        },
        data: body,
      };

      const markPayrollMonthAsPaid = async (payrollMonthId) => {
          const payroll = await PayrollRecord.findOne({ 'months._id': payrollMonthId });
          if (!payroll) throw new Error('Payroll record not found');

          const targetMonth = payroll.months.id(payrollMonthId);
          if (!targetMonth) throw new Error('Month not found');

          targetMonth.taxStatus = 'paid';
          await payroll.save();

          return targetMonth;
};
     // console.log(options)
       //console.log(body)
    const response = await axios(options);
    const chapaResponse = response.data;
    const updatedMonth = await markPayrollMonthAsPaid(payrollMonthId);

 
    res.status(201).json({
      message: "successfully creted",
      paymentUrl: chapaResponse.data.checkout_url,
      updatedMonth
    });

  } catch (error) {
    console.error('Payroll payment error' , error.message);
    console.error(error);
    res.status(500).json({ message: 'Failed to initialize payroll payment' });
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

    audit.save()

    // 4. Prepare Chapa payment body
    const body = {
      "amount": String(amount),
      "currency": 'ETB',
      "email":email,
      "first_name": firstName,
      "last_name": lastName,
      "phone_number": phone,
      "tx_ref": tx_ref,
       "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      "return_url": `http://localhost:3000/transaction`,
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments",
      "meta[hide_receipt]": "true"
    };

    const options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm", // Replace with your Chapa test key
          "Content-Type": "application/json",
        },
        data: body,
      };

    // 5. Initiate Chapa payment
    const response = await axios(options);
    const chapaResponse = response.data;
    vat.status = "paid"

    res.status(201).json({
      message: "successfully creted",
      paymentUrl: chapaResponse.data.checkout_url,
    });
  } catch (error) {
    console.error('VAT payment error:', error);
    res.status(500).json({ message: 'Failed to initialize VAT payment' });
  }
};

// === PROFIT TAX PAYMENT CONTROLLER ===
 exports.profitTaxPayment = async (req, res) => {
  try {
    const { profitTaxId } = req.params;
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

    audit.save()

    const body = {
      "amount": String(amount),
      "currency": 'ETB',
      "email":email,
      "first_name": firstName,
      "last_name": lastName,
      "phone_number": phone,
      "tx_ref": tx_ref,
       "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      "return_url": `http://localhost:3000/transaction`,
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments",
      "meta[hide_receipt]": "true"
    };
       const options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm", // Replace with your Chapa test key
          "Content-Type": "application/json",
        },
        data: body,
      };
     // console.log(options)
       //console.log(body)
    const response = await axios(options);
    const chapaResponse = response.data;
    profitTaxRecord.status = "Paid"
  
    res.status(201).json({
      message: "successfully creted",
      paymentUrl: chapaResponse.data.checkout_url,
    });

  } catch (error) {
    console.error('Profit tax payment error:', error);
    res.status(500).json({ message: 'Failed to initialize profit tax payment' });
  }
};


